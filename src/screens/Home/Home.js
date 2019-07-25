import React, { useState, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import storage, { useConfig } from '../../storage';
import { Download, Upload } from '../../file';

import Form from './Form';
import Records from './Records';
import Preview from '../../Preview';
import { useToolBar } from '../../ToolBar';

function createNewRecord(config) {
  return (prev = {}) => {
    const rec = config.structure.reduce((res, st) => {
      let v = '';
      if (st.sample === undefined || st.sample === '') {
        v = prev[st.name];
      } else {
        v = st.sample;
      }
      res[st.name] = v;
      return res;
    }, {});

    rec.DATE = format(new Date(), 'YYYY-MM-DD');
    rec.id = undefined;
    rec.PN = '';
    rec.NAME = '';
    rec.DOB = '';
    return rec;
  };
}

function createBackup() {
  const config = storage.loadConfig();
  const records = storage.loadRecords();
  const data = {};
  for (let i = 0; i < records.length; i += 1) {
    const record = storage.getRecord(records[i]);
    data[record.id] = record;
  }

  const filename = format(new Date(), 'YYYY-MM-DD')
  return {
    name: `Formish-Backup-${filename}.json`,
    data: JSON.stringify({ config, records, data }),
    type: 'application/json'
  };
}

function createLoad(setRecords) {
  return (data) => {
    try {
      const obj = JSON.parse(data);
      if (!obj.config) throw new Error(`No configuration found`);
      if (!Array.isArray(obj.config.structure)) throw new Error('No valid config structure found');
      if (!obj.config.markdown) throw new Error('No configuration template found');
      if (!obj.records || !Array.isArray(obj.records)) throw new Error('No data records found');
      if (!obj.data || typeof obj.data !== 'object') throw new Error('No data content found');

      const currentIds = new Set(storage.loadRecords());

      let count = 0;
      obj.records.forEach((id) => {
        const record = obj.data[id];
        if (!record || record.id !== id) return;
        if (currentIds.has(id)) return;

        count += 1;
        storage.saveRecord(record);
        currentIds.add(record.id);
      });
      window.alert(`${count} records appended`);

      const recordsArray = Array.from(currentIds.keys()).sort();
      console.log(recordsArray);
      storage.saveRecords(recordsArray);
      setRecords(recordsArray);
    } catch (err) {
      window.alert(`Load failed: ${err.message}`);
    }
  }
}

function createRestore(setRecords) {
  return (data) => {
    try {
      const obj = JSON.parse(data);
      if (!obj.config) throw new Error(`No configuration found`);
      if (!Array.isArray(obj.config.structure)) throw new Error('No valid config structure found');
      if (!obj.config.markdown) throw new Error('No configuration template found');
      if (!obj.records || !Array.isArray(obj.records)) throw new Error('No data records found');
      if (!obj.data || typeof obj.data !== 'object') throw new Error('No data content found');
      if (window.confirm('Are you sure you want to replace the existing data ? This action is irreversible.')) {
        // Remove all records that don't have any data at all
        const existingRecords = obj.records.filter((id) => {
          const record = obj.data[id];
          if (!record || record.id !== id) return false;
          storage.saveRecord(record);
          return true;
        });

        storage.saveRecords(existingRecords);
        storage.saveConfig(obj.config);

        setRecords(existingRecords);
      }
    } catch (err) {
      window.alert(`Restoration failed: ${err.message}`);
    }
  }
}

export default function Home() {
  const config = useConfig();
  const createRecord = useMemo(() => {
    return createNewRecord(config);
  }, [config]);

  const [records, setRecords] = useState(storage.loadRecords)
  const [record, setRecord] = useState(createRecord);
  const [modified, setModified] = useState(false);

  const handleChange = useCallback((changedRecord) => {
    setRecord(changedRecord);
    setModified(true);
  }, []);

  const addRecord = useCallback(() => {
    setRecord(prev => createRecord(prev));
  }, [createRecord]);

  const handleSelect = useCallback((id) => {
    if (!modified || window.confirm('Your changes are not saved. Ignore changes ?')) {
      setRecord(storage.getRecord(id));
      setModified(false);
    }
  }, [modified]);

  const handleSave = useCallback(() => {
    const records = storage.saveRecord(record);
    if (!record.id) {
      setRecords(records);
    }
    setRecord(storage.getRecord(records[0]));
    setModified(false);
  }, [record]);

  useToolBar(() => (
    <>
      <Download onPrepare={createBackup}>Backup</Download>
      <Upload onChange={createRestore(setRecords)}>Restore</Upload>
      <Upload onChange={createLoad(setRecords)}>Load</Upload>
    </>
  ), [setRecords]);

  return (
    <div className="Full">
      <div className="Half">
        <Form
          record={record}
          onSave={handleSave}
          onChange={handleChange}
          modified={modified}
          addRecord={addRecord}
        />
      </div>
      <div className="Half">
        <Records
          records={records}
          selected={record.id}
          setSelected={handleSelect}
        />
        <Preview
          record={record}
          source={config.markdown}
          structure={config.structure}
          printable={record.id && !modified}
        />
      </div>
    </div>
  );
}