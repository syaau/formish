import React, { useState, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import storage from './storage';

import { useToolBar } from './ToolBar';
import Designer from './Designer';
import Records from './Records';
import './App.css';
import { useMarkDown } from './processor';

function exportTemplate(config) {
  return () => {
    console.log('Export', config);
  };
}

function importTemplate(setConfig) {
  return (content) => {
    console.log('import template', content);
  };
}

function backup(config, records) {
  return () => {
    console.log('Backup', config, records);
  };
}

function restore(setConfig, setRecords) {
  return () => {

  };
}

function Upload({ onChange, ...other }) {
  const ref = useRef();

  const handleClick = useCallback(() => {
    ref.current.click();
  }, []);

  const handleChange = useCallback((e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(reader.result);
      }
      reader.readAsText(e.target.files[0]);
    }
  }, [onChange]);

  return (
    <>
      <input ref={ref} onChange={handleChange} type="file" style={{ display: 'none' }} />
      <button {...other} onClick={handleClick}></button>
    </>
  );
}

const defaultRef = {
  DOCTOR: '<DOCTOR>',
};

function createNewRecord(ref = defaultRef) {
  return Object.assign({}, ref, {
    NAME: '<NAME>',
    DATE: format(new Date(), 'YYYY-MM-DD'),
    GENDER: 'Female',
    MARRIED: true,
  });
}

function App() {
  const [edit, setEdit] = useState(false);
  const [config, setConfig] = useState(storage.loadConfig);
  const [records, setRecords] = useState(storage.loadRecords);
  const [currentRecord, setCurrentRecord] = useState(createNewRecord);
  const markdown = useMarkDown(config.markdown, config.structure, currentRecord);

  const setSelected = useCallback((id) => {
    setCurrentRecord(storage.getRecord(id) || createNewRecord());
  }, []);

  console.log('Records', records);
  const onSave = useCallback((value) => {
    // see if its a create
    const valueToSave = value.id ? value : { id: Date.now(), ...value };
    storage.saveRecord(valueToSave.id, valueToSave);
    if (!value.id) {
      setRecords((prevRecords) => {
        const newRecords = [valueToSave.id].concat(prevRecords);
        storage.saveRecords(newRecords);
        return newRecords;
      });
    }
    setCurrentRecord(valueToSave);
  }, []);

  useToolBar(() => (
    <>
      <button onClick={exportTemplate(config)}>Export Template</button>
      <Upload onChange={importTemplate(setConfig)}>Restore Template</Upload>
    </>
  ), [config]);

  useToolBar(() => (
    <>
      <button onClick={backup(config, records)}>Backup</button>
      <button onClick={restore(setConfig, setRecords)}>Restore</button>
    </>
  ), [config, records]);

  useToolBar(() => (
    <>
      <button onClick={() => setEdit(v => !v)}>Edit</button>
    </>
  ), [edit])

  const Main = (
    <div className="Full">
      <div className="Half">
        <Records
          records={records}
          config={config}
          record={currentRecord}
          onChangeRecord={setCurrentRecord}
          onSave={onSave}
          setSelected={setSelected}
        />
      </div>
      <div className="Half Preview">
        <ReactMarkdown source={markdown} />
      </div>
    </div>
  );

  return edit ? <Designer /> : Main;
}

export default App;
