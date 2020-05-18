import React, { useCallback, useState, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import storage, { useRecord, useConfig } from '../../storage';

function itemKey(index, data) {
  return data[index];
}

const Row = React.memo(({ data, index, style, setSelected, selected, fields, widths }) => {
  const key = data[index];
  const item = useRecord(key);

  const handleClick = useCallback(() => {
    setSelected(key);
  }, [key, setSelected]);

  return (
    <div className={`GridRow${selected === key?' selected':''}`} style={style} onClick={handleClick}>
      {fields.map((f, i) => (
        <div key={f.name} style={{ paddingLeft: '5px', width: `${widths[i]*100}%` }}>{item[f.name]}</div>
      ))}
    </div>
  );
});

export default function Records({ records, setSelected, selected }) {
  const config = useConfig();
  const displayFields = config.structure.filter(s => s.searchable);

  const [filter, setFilter] = useState('');
  const updateFilter = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  const loadedRecords = useMemo(() => {
    const allRecords = {};
    records.forEach(id => {
      allRecords[id] = storage.getRecord(id);
    });
    return allRecords;
  }, [records]);

  const fieldWidths = useMemo(() => {
    const widths = displayFields.map(_ => 0);
    console.log('Records', records);
    for (let i = 0; i < records.length; i++) {
      const record = loadedRecords[records[i]];
      displayFields.forEach((field, idx) => {
        const v = record[field.name];
        console.log('Value', v, field.name, record);
        widths[idx] = Math.max(widths[idx], String(v).length);
      });
    }
    console.log('Widths', widths);
    const total = widths.reduce((a, w) => a + w, 0);
    return widths.map(w => w/total);
  }, [records, displayFields]);

  const filteredRecords = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return records;
    return records.filter((id) => {
      const record = loadedRecords[id];
      const keywords = displayFields.map(f => record[f.name]).join('|');
      return keywords.toLowerCase().indexOf(f) >= 0;
    });
  }, [records, filter, displayFields]);

  const downloadCSV = useCallback(() => {
    const filename = `formish-records-${new Date().toISOString()}.csv`;
    const config = storage.loadConfig();
    const keys = config.structure.map(m => m.name);

    let text = keys.map(k => JSON.stringify(k)).join(',') + "\r\n";
    filteredRecords.forEach((id) => {
      const record = loadedRecords[id];
      text += keys.map(k => {
        const v = record[k];
        if (v === undefined || v === null) {
          return '';
        } else {
          return JSON.stringify(v);
        }
      }).join(',') + "\r\n";
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [filteredRecords]);

  function ItemRow(props) {
    return <Row {...props} setSelected={setSelected} selected={selected} fields={displayFields} widths={fieldWidths} />
  };

  let Body = null;
  if (filteredRecords.length === 0) {
    Body = (
      <div style={{
        display: 'flex',
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="NoRecords">No Records Found</div>
      </div>
    );
  } else {
    Body = (
      <List
        height={240}
        itemCount={filteredRecords.length}
        itemData={filteredRecords}
        itemKey={itemKey}
        itemSize={30}
      >
        {ItemRow}
      </List>
    );
  }

  return (
    <div className="Records">
      <div className="Header">
        <b>Available Records</b>
        <input value={filter} onChange={updateFilter} placeholder="Search" />
        {`Records ${filteredRecords.length}/${records.length}`}
        <div style={{ flex: 1, textAlign: 'right'}}>
          <button onClick={downloadCSV}>Download CSV</button>
        </div>
      </div>
      {Body}
    </div>
  );
}