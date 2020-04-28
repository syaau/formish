import { FieldInfo, Record, Fields } from './types';
import { getColumnName, extractColRow, getMinMax } from './getColumnName';
import { GOOGLE_DRIVE_API_KEY } from './constants';
import { getFields } from './loadConfiguration';
import { convertToSheetTime } from './convertToSheetTime';

function createFlattener(fields: Fields) {
  const [min, max] = getMinMax(fields);

  const size = max - min + 1;

  return function flatten(record: Record) {
    const value = new Array(size).fill(null);
    record.timestamp = convertToSheetTime(Date.now());

    fields.forEach((f, idx) => {
      const field = fields[idx].name;
      value[f.column - min] = record[field];
    });

    return value;
  }
}

export async function appendData(spreadsheetId: string, records: Array<Record>) {
  const fields = await getFields(spreadsheetId);
  const flatten = createFlattener(fields);
  const [min] = getMinMax(fields);

  const firstCol = getColumnName(min);

  const res = await gapi.client.sheets.spreadsheets.values.append({
    key: GOOGLE_DRIVE_API_KEY,
    spreadsheetId,
    range: `${firstCol}:${firstCol}`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      majorDimension: 'ROWS',
      values: records.map(flatten),
    },
  });

  // Get the range in sheet and range
  // @ts-ignore
  const updatedRange = res.result.updates.updatedRange.split('!');
  // Extract just the first cell
  const [firstCell] = updatedRange[updatedRange.length - 1].split(':');

  // Get the row number, stripping out the column character(s);
  const [, startingRow] = extractColRow(firstCell);

  const metaDataRes = await gapi.client.sheets.spreadsheets.batchUpdate({
    key: GOOGLE_DRIVE_API_KEY,
    spreadsheetId,
    resource: {
      requests: records.map((_, idx) => ({
        createDeveloperMetadata: {
          developerMetadata: {
            location: {
              dimensionRange: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: startingRow + idx,
                endIndex: startingRow + idx + 1,
              }
            },
            metadataKey: 'i',
            visibility: 'PROJECT',
          }
        }
      })),
    },
  });

  // @ts-ignore
  metaDataRes.result.replies.forEach((reply, idx) => {
    // @ts-ignore
    records[idx]._id = reply.createDeveloperMetadata.developerMetadata.metadataId;
  });

  return records;
}

export async function updateRecords(spreadsheetId: string, records: Array<Record>) {
  const fields = await getFields(spreadsheetId);
  const flatten = createFlattener(fields);

  await gapi.client.sheets.spreadsheets.values.batchUpdateByDataFilter({
    key: GOOGLE_DRIVE_API_KEY,
    spreadsheetId,
    resource: {
      data: records.map((record) => ({
        dataFilter: {
          developerMetadataLookup: {
            locationType: 'ROW',
            metadataId: record._id,
          }
        },
        majorDimension: 'ROWS',
        values: flatten(record),
      })),
    }
  });
}
