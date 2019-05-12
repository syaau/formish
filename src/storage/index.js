import { useEffect, useState } from 'react';

const defaultStructure = [
  { name: 'DATE', type: 'Date' },
  { name: 'NAME', type: 'Text' },
  { name: 'DOB', type: 'Date' },
  { name: 'GENDER', type: 'Choices', choices: 'Male,Female' },
  { name: 'MARRIED', type: 'Yes/No' },
  { name: 'DOCTOR', type: 'Text' },
  { name: 'DIAGNOSIS', type: 'List' },
  { name: 'CONDITION', type: 'Text' },
  { name: 'MEDICATIONS', type: 'List' },
];

const defaultMarkDown = (`
# Report
### {{dddd}}, {{Do}} {{MMM}}, {{YYYY}}

Report for {{Mr}} {{NAME}}. {{He}} has been diagnosed with **{{DIAGNOSIS}}**.
{{His}} condition is {{CONDITION}}.

He is {{AGE}} old as per our records.

{{MEDICATIONS:1.}}

&nbsp;${'  '}
................................${'  '}
{{DOCTOR}}
`);

const listeners = {};

const storage = {
  loadConfig: () => {
    try {
      const res = JSON.parse(localStorage.get('configuration'));
      if (res === null || !res.structure || !res.markdown) {
        throw new Error('Invalid data');
      }
    } catch (err) {
      return {
        structure: defaultStructure,
        markdown: defaultMarkDown,
      };
    }
  },
  saveConfig: (config) => {
    localStorage.setItem('configuration', JSON.stringify(config));
  },

  loadRecords: () => {
    try {
      const r = JSON.parse(localStorage.getItem('records'));
      if (!Array.isArray(r)) throw new Error('Invalid data');
      return r;
    } catch (err) {
      return [];
    }
  },

  saveRecords: (records) => {
    if (!Array.isArray(records)) {
      throw new Error('Records are meant to be an array');
    }

    localStorage.setItem('records', JSON.stringify(records));
  },

  getRecord: (id) => {
    try {
      const res = JSON.parse(localStorage.getItem(`rec-${id}`));
      if (!res) throw new Error('Invalid data');
      return res;
    } catch (err) {
      return {};
    }
  },

  saveRecord: (id, data) => {
    localStorage.setItem(`rec-${id}`, JSON.stringify(data));
    const list = listeners[id];
    if (list) {
      list.forEach((listener) => listener(data));
    }
  },

  listen: (id, listener) => {
    const existingList = listeners[id];
    const list = existingList || [];
    if (list !== existingList) {
      listeners[id] = list;
    }

    list.push(listener);

    return () => {
      const idx = list.indexOf(listener);
      if (idx >= 0) {
        list.splice(idx, 1);
        if (list.length === 0) {
          delete listeners[id];
        }
      }
    };
  }
}

export function useRecord(id) {
  const [record, setRecord] = useState(storage.getRecord(id));
  useEffect(() => {
    return storage.listen(id, setRecord);
  }, [id]);

  return record;
}

export default storage;
