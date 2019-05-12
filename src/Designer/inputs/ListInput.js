import React from 'react';
import useOnChange from './useOnChange';

export default function ListInput({ name, onChange }) {
  const handleChange = useOnChange(onChange);
  return <textarea name={name} onChange={handleChange} />
}
