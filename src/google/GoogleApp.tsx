import React, { useEffect, useState } from 'react';
import { CLIENT_ID, API_KEY } from './constants';
import { DevToolBar } from './DevToolBar';

type ContextData = null | undefined | gapi.auth2.BasicProfile;

export const GContext = React.createContext<ContextData>(null);
// const CLIENT_ID = '';
// const API_KEY = '';
const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];
const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",     // Access to files created by the app itself
  'https://www.googleapis.com/auth/drive.appdata'   // Access to files to our app specific folder
].join(' ');


export function GoogleApp({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<ContextData>();

  useEffect(() => {
    function updateSignInStatus(signedIn: boolean) {
      if (!signedIn) {
        setCurrentUser(null);
      } else {
        const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
        setCurrentUser(profile);
      }
    }

    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
      const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn;
      isSignedIn.listen(updateSignInStatus);
      updateSignInStatus(isSignedIn.get());
    });
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    return (
      <GContext.Provider value={currentUser}>
        <DevToolBar />
        {children}
      </GContext.Provider>
    );
  }
  return <GContext.Provider value={currentUser}>{children}</GContext.Provider>
}
