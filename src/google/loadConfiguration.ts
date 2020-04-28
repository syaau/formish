import { GOOGLE_DRIVE_API_KEY, TEMPLATE_META_DATA_ID } from "./constants";
import { Fields, FieldInfo } from "./types";

export async function getTemplate(spreadsheetId: string): Promise<null | string> {
  const res = await gapi.client.sheets.spreadsheets.developerMetadata.get({
    key: GOOGLE_DRIVE_API_KEY,
    spreadsheetId,
    metadataId: TEMPLATE_META_DATA_ID,
  });

  if (!res.result.metadataValue) return null;
  if (res.result.metadataKey !== 'template') return null;

  return res.result.metadataValue;
}

export async function saveTemplate(spreadsheetId: string, template: string) {
  const res = await gapi.client.sheets.spreadsheets.batchUpdate({
    key: GOOGLE_DRIVE_API_KEY,
    spreadsheetId,
    resource: {
      requests: [{
        updateDeveloperMetadata: {
          developerMetadata: {
            metadataId: TEMPLATE_META_DATA_ID,
            metadataKey: 'template',
            metadataValue: template,
            visibility: 'PROJECT',
          },
        },
      }],
    },
  });
  console.log('Result', res.result);
}

export async function getRowIds(spreadsheetId: string): Promise<Array<{ id: number, row: number }>> {
  const res = await gapi.client.sheets.spreadsheets.developerMetadata.search({
    key: GOOGLE_DRIVE_API_KEY,
    spreadsheetId,
    resource: {
      dataFilters: [{
        developerMetadataLookup: {
          locationType: 'ROW',
          metadataKey: 'i',
          visibility: 'PROJECT',
        },
      }],
    },
  });

  if (!res.result.matchedDeveloperMetadata) return [];
  const result = res.result.matchedDeveloperMetadata.map((k) => {
    // @ts-ignore
    const metadata = k.developerMetadata;
    return {
      // @ts-ignore
      id: metadata.metadataId as number,
      // @ts-ignore
      row: metadata.location.dimensionRange.startIndex as number,
    };
  });

  console.log('Row Metadata', result);
  return result;
}

export async function getFields(spreadsheetId: string): Promise<Fields> {
  const res = await gapi.client.sheets.spreadsheets.developerMetadata.search({
    key: GOOGLE_DRIVE_API_KEY,
    spreadsheetId,
    resource: {
      dataFilters: [{
        developerMetadataLookup: {
          locationType: 'COLUMN',
          visibility: 'PROJECT'
        }
      }],
    },
  });

  // Return empty instance if the fields are not found
  if (!res.result.matchedDeveloperMetadata) return [];

  const result = res.result.matchedDeveloperMetadata.map((k) => {
    // @ts-ignore
    const metadata = k.developerMetadata;

    return {
      // @ts-ignore
      id: metadata.metadataId,
      // @ts-ignore
      column: metadata.location.dimensionRange.startIndex,
      // @ts-ignore
      name: metadata.metadataKey,
      // @ts-ignore
      def: JSON.parse(metadata.metadataValue),
    } as FieldInfo<any>;
  });

  console.log('loadConfig result', result);
  return result;
}
