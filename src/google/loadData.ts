import { getColumnName, getMinMax } from './getColumnName';
import { GOOGLE_DRIVE_API_KEY } from './constants';
import { getFields, getRowIds } from './loadConfiguration';

export async function loadData(spreadsheetId: string) {
  const fields = await getFields(spreadsheetId);
  const rows = await getRowIds(spreadsheetId);
  console.log('Got rows information', rows);
  const [min, max] = getMinMax(fields);
  const reverseMap: string[] = [];

  fields.forEach((field) => {
    reverseMap[field.column] = field.name;
  });

  const range = `${getColumnName(min)}:${getColumnName(max)}`;
  const res = await gapi.client.sheets.spreadsheets.values.get({
    key: GOOGLE_DRIVE_API_KEY,
    spreadsheetId,
    range,
  });

  // @ts-ignore
  return res.result.values.map((row) => {
    return row.reduce((res, v, idx) => {
      const name = reverseMap[idx];
      if (name) res[name] = v;
      return res;
    }, {});
  });
}
