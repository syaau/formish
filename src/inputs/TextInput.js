import React from 'react';
import useOnChange from './useOnChange';

export default function TextInput({ onChange, ...other }) {
  const handleChange = useOnChange(onChange);
  return <input type="text" onChange={handleChange} {...other} />
};
