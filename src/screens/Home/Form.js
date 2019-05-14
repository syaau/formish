import React, { useCallback } from 'react';
import { types } from '../../inputs';
import { useConfig } from '../../storage';

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

export default function RecordForm({ record, onChange, onSave, modified, addRecord }) {
  const config = useConfig();

  const handleChange = useCallback((name, value) => {
    onChange((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, [onChange]);

  const saveCaption = record.id ? 'Update' : 'Create';

  return (
    <div className="RecordForm">
      {config.structure.map(({ type, name, choices }) => {
        const v = record[name];
        return (
          <LineInput
            key={name}
            value={v === undefined ? '' : v}
            type={type}
            name={name}
            choices={choices}
            onChange={handleChange}
          />
        );
      })}
      <div className="InputRow">
        <div style={{textAlign: 'right'}}>
          {record.id && <button onClick={addRecord} disabled={modified}>New Record</button>}
          <button onClick={onSave} disabled={!modified}>{saveCaption}</button>
        </div>
      </div>
    </div>
  );
}
