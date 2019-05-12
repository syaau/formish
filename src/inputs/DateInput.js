import React from 'react';
import useOnChange from './useOnChange';

export default function DateInput({ onChange, ...other }) {
  const handleChange = useOnChange(onChange);
  return <input type="date" onChange={handleChange} {...other} />
}
