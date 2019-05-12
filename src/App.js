import React, { useState, useCallback, useMemo } from 'react';
import Printer from './Printer';

import Designer from './Designer';

import './App.css';

function App() {
  return (
    <Printer>
      <Designer />
    </Printer>
  );
}

export default App;
