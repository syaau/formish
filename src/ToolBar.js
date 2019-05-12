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
  }, dependencies);
}

export default function ToolBar(props) {
  const [tools, updateTools] = useState([]);

  const registerTools = useCallback((seq, Group) => {
    updateTools(prev => {
      const res = prev.slice();
      for (let i = 0; i < prev.length; i += 1) {
        if (prev[i].seq > seq) {
          res.splice(i, { seq, Group });
          return res;
        }
      }
      res.push({ seq, Group });
      return res;
    });

    return () => {
      updateTools(prev => prev.filter(p => p.seq !== seq));
    }
  }, [updateTools]);

  return (
    <ToolBarContext.Provider value={registerTools}>
      {tools.length > 0 && (
        <div className="ToolBar">
          {tools.map(({ seq, Group }) => (
            <Group key={seq} />
          ))}
        </div>
      )}
      <React.Fragment {...props} />
    </ToolBarContext.Provider>
  )
}
