import React from 'react';
import useOnChange from './useOnChange';

export default function DateInput({ name, onChange }) {
  const handleChange = useOnChange(onChange);
  return <input type="date" name={name} onChange={handleChange} />
}
