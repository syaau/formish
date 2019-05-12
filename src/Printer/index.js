import React, { useState, useContext, useEffect } from 'react';

const PrinterContext = React.createContext(() => {
  throw new Error('Did you forget to include your `Printer` in the root app ?');
});

export function usePrinter(element) {
  const setActivePaper = useContext(PrinterContext);
  return () => {
    setActivePaper(element);
  }
}

export default function Printer({ children }) {
  const [activePaper, setActivePaper] = useState(null);

  useEffect(() => {
    window.onbeforeprint = () => {
      setActivePaper(null);
      console.log('Before print method');
    }
    window.onafterprint = () => {
      setActivePaper(null);
    }
  }, []);

  useEffect(() => {
    if (activePaper === null) {
      return;
    }

    window.print();
    console.log('Just after print');
  }, [activePaper]);

  return (
    <PrinterContext.Provider value={setActivePaper}>
      {activePaper ? (
        <div className="PrintPreview">
          {activePaper}
        </div>
      ) : children}
    </PrinterContext.Provider>
  );
}
