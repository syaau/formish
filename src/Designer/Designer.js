import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import Structure from './Structure';
import { useMarkDown } from '../processor';
import { usePrinter } from '../Printer';

const defaultInputs = [
  { name: 'DATE', type: 'Date' },
  { name: 'NAME', type: 'Text' },
  { name: 'DOB', type: 'Date' },
  { name: 'GENDER', type: 'Choices', choices: 'Male,Female' },
  { name: 'MARRIED', type: 'Yes/No' },
  { name: 'RECOMMENDATIONS', type: 'List' },
];

function loadStructure() {
  const config = localStorage.getItem('configuration');
  try {
    const res = JSON.parse(config);
    if (res === null) throw new Error('Empty');
    if (!res.structure || !res.markdown) throw new Error('Invalid data');

    return res;
  } catch (err) {
    return {
      structure: defaultInputs,
      markdown: '# Hello World',
    };
  }
}

function saveStructure(data) {
  localStorage.setItem('configuration', JSON.stringify(data));
}

const data = loadStructure();

export default function Designer() {
  const [structure, setStructure] = useState(data.structure);
  const [source, setSource] = useState(data.markdown);
  const handleSource = useCallback((e) => setSource(e.target.value), []);
  const markdown = useMarkDown(source, structure);

  const onSave = useCallback(() => {
    saveStructure({
      markdown: source,
      structure: structure,
    });
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