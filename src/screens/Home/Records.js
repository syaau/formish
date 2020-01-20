import React, { useCallback, useState, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import storage, { useRecord } from '../../storage';

function itemKey(index, data) {
  return data[index];
}

const Row = React.memo(({ data, index, style, setSelected, selected }) => {
  const key = data[index];
  const item = useRecord(key);

  const handleClick = useCallback(() => {
    setSelected(key);
  }, [key, setSelected]);

  return (
    <div className={`GridRow${selected === key?' selected':''}`} style={style} onClick={handleClick}>
      <div style={{ width: 120 }}>{item.PN}</div>
      <div style={{ width: 120 }}>{item.DATE}</div>
      <div style={{ flex: 1}}>{item.NAME}</div>
    </div>
  );
});

export default function Records({ records, setSelected, selected }) {
  const [filter, setFilter] = useState('');
  const updateFilter = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  const filteredRecords = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return records;
    return records.filter((id) => {
      const name = storage.getRecord(id).NAME;
      const pn = (storage.getRecord(id).PN || '').trim().toLowerCase();
      if (!name) return false;
      return pn === f || name.toLowerCase().indexOf(f) >= 0;
    });
  }, [records, filter]);

  const downloadCSV = useCallback(() => {
    const filename = `formish-records-${new Date().toISOString()}.csv`;
    const config = storage.loadConfig();
    const keys = config.structure.map(m => m.name);

    let text = keys.map(k => JSON.stringify(k)).join(',') + "\r\n";
    filteredRecords.forEach((id) => {
      const record = storage.getRecord(id);
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
    return <Row {...props} setSelected={setSelected} selected={selected} />
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