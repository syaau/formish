import React, { useState } from 'react';
import Home from './screens/Home';
import Designer from './screens/Designer';

import { useToolBar } from './ToolBar';

import './App.css';

function App() {
  const [edit, setEdit] = useState(false);

  useToolBar(() => (
    <>
      <button onClick={() => setEdit(!edit)}>{edit ? 'Reports' : 'Design'}</button>
    </>
  ), [edit])

  return edit ? <Designer /> : <Home />;
}

export default App;
