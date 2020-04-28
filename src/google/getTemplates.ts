import { GOOGLE_DRIVE_API_KEY } from "./constants";

export async function getTemplates() {
  const res = await gapi.client.drive.files.list({
    // spaces: 'appDataFolder',
    fields: 'nextPageToken, files(id, name)',
    q: 'appProperties has {key=\'type\' and value=\'formish\'}',
    pageSize: 100,
    key: GOOGLE_DRIVE_API_KEY,
  });

  return res.result.files;
}
