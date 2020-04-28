import React, { useContext } from "react";
import { GContext } from './GoogleApp';
import { createTemplate } from './createTemplate';
import { getTemplates } from "./getTemplates";

function getIcon(user?: null | gapi.auth2.BasicProfile) {
  if (user === undefined) {
    return '...';
  } else if (user === null) {
    return <button onClick={() => gapi.auth2.getAuthInstance().signIn()}>Sign In</button>
  }
  getTemplates().then((templates) => {
    console.log('Got templates', templates);
  });

  // createTemplate('example').then(id => console.log('File id', id));
  // // Let's try to read the documents from google drive
  // gapi.client.drive.files.create({
  //   fields: 'id',
  //   resource: {
  //     name: 'example-file-123.json',
  //   },
  //   // @ts-ignore
  //   media: {
  //     mimeType: 'application/json',
  //     body: JSON.stringify({ one: 1, two: 2 }),
  //   },
  // }).then((file: gapi.client.drive.File) => {
  //   console.log('Fiel id', file.id);
  // });

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      {/* <img width="100%" height="100%" src={user.getImageUrl()} alt={user.getName()} onClick={() => gapi.auth2.getAuthInstance().signOut()} /> */}
      <button onClick={() => gapi.auth2.getAuthInstance().signOut()}>{`Sign out ${user.getName()}`}</button>
      <button onClick={() => createTemplate('Example')}>Create Template</button>
    </div>
  );
}

export function GoogleIcon() {
  const user = useContext(GContext);

  return (
    <div style={{ width: '40px', height: '40px' }}>
      {getIcon(user)}
    </div>
  );
}
