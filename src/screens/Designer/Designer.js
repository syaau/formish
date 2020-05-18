import React, { useState, useCallback } from 'react';
import Structure from './Structure';
import Help from './Help';
import storage from '../../storage';
import Preview from '../../Preview';
import { useToolBar } from '../../ToolBar';
import { Download, Upload } from '../../file';

function importTemplate(setStructure, setSource) {
  return (data) => {
    try {
      const config = JSON.parse(data);
      if (!config.markdown || typeof config.markdown !== 'string') throw new Error('No template content found');
      if (!config.structure || !Array.isArray(config.structure)) throw new Error('No template definition found');
      if (window.confirm('Are you sure you want to replace the existing template with the new one ?')) {
        config.structure.forEach(f => {
          if (f.name === 'PN' || f.name === 'NAME' || f.name === 'DATE') {
            if (f.searchable === undefined) f.searchable = true;
          }
        });
        storage.saveConfig(config);
        setStructure(config.structure);
        setSource(config.markdown);
      }
    } catch (err) {
      window.alert(`Failed to import template: ${err.message}`);
    }
  }
}

function exportTemplate(structure, markdown) {
  return () => {
    return {
      name: `Formish-Template.json`,
      data: JSON.stringify({ structure, markdown }),
      type: 'application/json',
    };
  }
}

export default function Designer() {
  const data = storage.loadConfig();
  const [help, setHelp] = useState(false);
  const [structure, setStructure] = useState(data.structure);
  const [source, setSource] = useState(data.markdown);
  const [modified, setModified] = useState(false);

  const toggleHelp = useCallback(() => setHelp(h => !h), []);
  const handleSource = useCallback((e) => {
    setSource(e.target.value);
    setModified(true);
  }, []);

  const handleSave = useCallback(() => {
    storage.saveConfig({
      markdown: source,
      structure,
    });
    setModified(false);
  }, [structure, source]);

  const handleStructure = useCallback((idx) => {
    return (value) => {
      setStructure(prev => {
        return prev.map((v, i) => i === idx ? value(v) : v);
      });
      setModified(true);
    };
  }, []);

  const handleAdd = useCallback(() => {
    setStructure(prev => prev.concat({ type: 'Text', name: `FIELD_${prev.length + 1}`}));
    setModified(true);
  }, []);

  useToolBar(() => (
    <>
      <Download onPrepare={exportTemplate(structure, source)}>Export Template</Download>
      <Upload onChange={importTemplate(setStructure, setSource)}>Import Template</Upload>
    </>
  ));

  return (
    <div className="App">
      <div className="Full">
        <div className="Half Editor" style={{position: 'relative'}}>
          <button style={{position: 'absolute', right: 10, top: 10}} onClick={toggleHelp}>
            {help ? 'Close' : 'Help'}
          </button>
          <div className="Full" style={{ padding: '10px', backgroundColor: '#eee' }}>
            {help
              ? <Help />
              : <textarea style={{ outline: 0 }} value={source} onChange={handleSource} />
            }
          </div>
          <table>
            <tbody>
              {structure.map((s, i) => <Structure key={i} value={s} onChange={handleStructure(i)} />)}
              <tr style={{ backgroundColor: 'black' }}>
                <td>
                  <button style={{ fontSize: '14pt' }} onClick={handleAdd}>Add</button>
                </td>
                <td colSpan="2" />
                <td align="right">
                  {modified && <button style={{ fontSize: '14pt' }} onClick={handleSave}>Save</button>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="Half">
          <Preview source={source} structure={structure} record={null} />
        </div>
      </div>
    </div>
  );
}