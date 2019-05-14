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
      </div>
      {Body}
    </div>
  );
}