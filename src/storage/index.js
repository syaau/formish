import { useEffect, useState } from 'react';
import { defaultStructure, defaultMarkDown } from './defaults';

const listeners = {};

const storage = {
  loadConfig: () => {
    try {
      const res = JSON.parse(localStorage.getItem('configuration'));
      if (res === null || !res.structure || !res.markdown) {
        throw new Error('Invalid data');
      }
      res.structure.forEach(f => {
        if (f.name === 'PN' || f.name === 'NAME' || f.name === 'DATE') {
          if (f.searchable === undefined) f.searchable = true;
        }
      });

      return res;
    } catch (err) {
      console.log('Error', err);
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

  saveRecord: (data) => {
    let record = data;
    if (!data.id) {
      const records = storage.loadRecords();
      const id = Date.now();
      record = Object.assign({}, data, { id });
      console.log('Saving record', id, record);
      localStorage.setItem(`rec-${id}`, JSON.stringify(record));
      records.unshift(id);
      storage.saveRecords(records);
      return records;
    } else {
      localStorage.setItem(`rec-${data.id}`, JSON.stringify(data));
      const list = listeners[data.id];
      if (list) {
        list.forEach((listener) => listener(data));
      }
      return [data.id];
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

export function useConfig() {
  return storage.loadConfig();
}

export function useRecord(id) {
  const [record, setRecord] = useState(storage.getRecord(id));
  useEffect(() => {
    return storage.listen(id, setRecord);
  }, [id]);

  return record;
}

export default storage;
