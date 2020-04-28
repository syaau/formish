import { GOOGLE_DRIVE_API_KEY } from './constants';

export async function createTemplate(name: string) {
  // const resource = {
  //   name: `${name}.formish`,
  //   parents: ['appDataFolder']
  // };
  // const media = {
  //   mimeType: 'application/json',
  //   body: JSON.stringify({ one: 1, two: 2 }),
  // };

  // const file = await gapi.client.drive.files.create({
  //   resource,
  //   // @ts-ignore
  //   media,
  //   fields: 'id',
  //   key: GOOGLE_DRIVE_API_KEY,
  // });
  // console.log('Google Drive create result', file.result.id);

  // Create a spreadsheet with the template meta data
  // const res = await gapi.client.sheets.spreadsheets.create({
  //   resource: {
  //     developerMetadata: [{
  //       metadataId: 1,
  //       metadataKey: 'config',
  //       metadataValue: ' '.repeat(3000),
  //       visibility: 'PROJECT',  // Give the metadata project visiblity
  //     }],
  //     properties: {
  //       title: `Formish DataSheet - ${name} - ${Date.now()}`,
  //     },
  //   },
  //   fields: 'spreadsheetId,spreadsheetUrl',
  //   key: GOOGLE_DRIVE_API_KEY,
  // });

  // const fileId = res.result.spreadsheetId as string;
  // const fileUrl = res.result.spreadsheetUrl as string;
  // console.log('Spreadsheet created with fileId', fileId, fileUrl);

  const updateRes = await gapi.client.drive.files.create({
    resource: {
      name: `Formish DataSheet ${Date.now()} 2.0`,
      mimeType: 'application/vnd.google-apps.spreadsheet',  // Create Google Sheet File
      appProperties: {
        type: 'formish'                                     // Make sure our app only list files using this property
      }
    },
    key: GOOGLE_DRIVE_API_KEY,
  });

  console.log('Update result', updateRes);

  return updateRes.result.id;
}
