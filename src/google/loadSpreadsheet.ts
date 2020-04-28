import { GOOGLE_DRIVE_API_KEY } from "./constants";

export async function loadSpreadsheet(spreadsheetId: string) {
  const res = await gapi.client.drive.files.get({
    fileId: spreadsheetId,
    fields: 'ownedByMe,capabilities.canEdit,name',
    key: GOOGLE_DRIVE_API_KEY,
  });

  console.log('Load Spreadsheet', res);

  // gapi.client.sheets.spreadsheets.developerMetadata.search({
  //   spreadsheetId,
  //   sheet: 'as',
  // })
  // const res = await gapi.client.sheets.spreadsheets.get({
  //   spreadsheetId,
  // });

  // gapi.client.drive.permissions.

  // const res = await gapi.client.drive.permissions.list({
  //   fileId: spreadsheetId,
  //   key: GOOGLE_DRIVE_API_KEY,
  // });

  // res.result.permissions[0].

}