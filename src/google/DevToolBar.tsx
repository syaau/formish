import React from 'react';
import { addFields, updateField, removeField } from './saveConfiguration';
import { getFields } from './loadConfiguration';
import { loadData } from './loadData';
import { appendData } from './appendData';

// Test spreadsheet
const spreadsheetId = '1_Jn4kMisCeZsDWt6n_qh-eFcR-u_4J_-rCBdLpt7GnI';

async function testAddFields() {
  const res = await addFields(spreadsheetId, [
    { name: 'timestamp', column: 0, def: { type: 'timestamp' }},
    { name: 'name', column: 1, def: { type: 'string' }},
    { name: 'age', column: 2, def: { type: 'number' }},
  ]);

  console.log('Add Fields', res);
}

async function testRemoveField() {
  const fields = await getFields(spreadsheetId);
  fields.forEach(async (field) => {
    const id = field.id;
    console.log('Removing field', id);
    await removeField(spreadsheetId, id);
  });
}

async function testGetFields() {
  const res = await getFields(spreadsheetId);
  console.log('Got fields', res);
}

async function testLoadData() {
  const res = await loadData(spreadsheetId);

  console.log('Load Data Result', res);

}

async function testAppendData() {
  const data = [{ name: 'Ranjan Shrestha', age: 18 }];
  const res = await appendData(spreadsheetId, data);
  console.log('append data result', res);
}

export function DevToolBar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <button onClick={testGetFields}>Load Fields</button>
      <button onClick={testAddFields}>Add Fields</button>
      <button onClick={testRemoveField}>Remove Fields</button>
      <button onClick={testLoadData}>Load Data</button>
      <button onClick={testAppendData}>Append Data</button>
    </div>
  );
}