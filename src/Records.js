import React, { useCallback } from 'react';
import { format } from 'date-fns';
import { FixedSizeList as List } from 'react-window';

import storage, { useRecord } from './storage';
import { types } from './inputs';

function Record({ id }) {
  const record = storage.getRecord(id);
  return (
    <div>{record.NAME}</div>
  );
}

function LineInput({ type, name, value, choices, onChange }) {
  const TypeInput = types.find(t => t.id === type).C;
  return (
    <div className="InputRow">
      <label>
        <span>{name}</span>
        <TypeInput name={name} choices={choices} onChange={onChange} value={value} />
      </label>
    </div>
  );
}

function RecordForm({ config, value, onChange, onSave }) {
  const handleChange = useCallback((name, value) => {
    onChange((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(value);
  }, [value, onSave]);

  const saveCaption = value.id ? 'Update' : 'Create';

  return (
    <div className="RecordForm">
      {config.structure.map(({ type, name, choices }) => {
        let v = value[name];
        if (v === undefined) {
          if (name === 'DATE') {
            v = format(new Date(), 'YYYY-MM-DD');
          } else {
            v = '';
          }
        }
        return <LineInput value={v} key={name} type={type} name={name} choices={choices} onChange={handleChange} />
      })}
      <div className="InputRow">
        <div style={{textAlign: 'right'}}>
          <button onClick={handleSave}>{saveCaption}</button>
        </div>
      </div>
    </div>
  );
}

const Row = React.memo(({ data, index, style, setSelected, selected }) => {
  const key = data[index];
  const item = useRecord(key);

  const handleClick = useCallback(() => {
    setSelected(key);
  }, [key]);

  return (
    <div className={`GridRow${selected === key?' selected':''}`} style={style} onClick={handleClick}>
      {item.DATE} - {item.NAME}
    </div>
  );
});

function itemKey(index, data) {
  return data[index];
}

export default function Records({ config, records, setSelected, record, onChangeRecord, onSave }) {
  function ItemRow(props) {
    return <Row {...props} setSelected={setSelected} selected={record.id} />
  };

  return (
    <div>
      <List
        height={200}
        itemCount={records.length}
        itemData={records}
        itemKey={itemKey}
        itemSize={35}
      >{ItemRow}</List>
      <RecordForm
        config={config}
        value={record}
        onChange={onChangeRecord}
        onSave={onSave}
      />
    </div>
  );
}