import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import Structure from './Structure';
import { useMarkDown } from '../processor';
import { usePrinter } from '../Printer';

import storage from '../storage';

const data = storage.loadConfig();
console.log('Data', data);

export default function Designer() {
  const [structure, setStructure] = useState(data.structure);
  const [source, setSource] = useState(data.markdown);
  const handleSource = useCallback((e) => setSource(e.target.value), []);
  const markdown = useMarkDown(source, structure);

  const onSave = useCallback(() => {
    // saveStructure({
    //   markdown: source,
    //   structure: structure,
    // });
  }, [structure, source]);

  const preview = (
    <div className="Paper">
      <ReactMarkdown source={markdown} />
    </div>
  );

  const print = usePrinter(preview);

  const handleStructure = useCallback((idx) => {
    return (value) => {
      console.log(`${idx}, ${value}`)
      setStructure(prev => {
        console.log('Prev', prev, value(prev[1]));
        return prev.map((v, i) => i === idx ? value(v) : v);
      });
    };
  }, []);

  const handleAdd = useCallback(() => {
    setStructure(prev => prev.concat({ type: 'Text', name: `FIELD_${prev.length + 1}`}));
  }, [])

  return (
    <div className="App">
      <div className="Full">
        <div className="Half Editor">
          <textarea value={source} onChange={handleSource} />
          <table>
            {structure.map((s, i) => <Structure key={i} value={s} onChange={handleStructure(i)} />)}
            <tr>
              <td colSpan="4">
                <button onClick={handleAdd}>Add + </button>
              </td>
            </tr>
          </table>
        </div>
        <div className="Half Preview">
          <button onClick={onSave}>Save</button>
          {preview}
        </div>
      </div>
    </div>
  );
}