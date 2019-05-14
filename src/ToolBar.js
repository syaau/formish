import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';

const ToolBarContext = React.createContext();

let seq = 0;
function useSeq() {
  const n = useRef(null);
  if (n.current === null) {
    seq += 1;
    n.current = seq;
  }

  return n.current;
}


export function useToolBar(Component, dependencies = []) {
  const registerTools = useContext(ToolBarContext);
  const groupSeq = useSeq();

  useEffect(() => {
    return registerTools(groupSeq, Component);
  // eslint-disable-next-line
  }, dependencies);
}

export default function ToolBar({ title, ...other }) {
  const [tools, updateTools] = useState([]);

  const registerTools = useCallback((seq, Group) => {
    updateTools(prev => {
      const res = prev.slice();
      res.push({ seq, Group });
      res.sort((a, b) => b.seq - a.seq);
      return res;
    });

    return () => {
      updateTools(prev => prev.filter(p => p.seq !== seq));
    }
  }, []);

  return (
    <ToolBarContext.Provider value={registerTools}>
      {tools.length > 0 && (
        <div className="ToolBar">
          <h3>{title}</h3>
          {tools.map(({ seq, Group }) => (
            <div key={seq} className="ToolBarGroup"><Group /></div>
          ))}
        </div>
      )}
      <React.Fragment {...other} />
    </ToolBarContext.Provider>
  )
}
