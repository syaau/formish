import React from 'react';
import useOnChange from './useOnChange';

export default function TextInput({ name, onChange, value }) {
  const handleChange = useOnChange(onChange);
  return <input type="text" value={value} name={name} onChange={handleChange} />
};
