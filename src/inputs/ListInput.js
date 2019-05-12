import React from 'react';
import useOnChange from './useOnChange';

export default function ListInput({ onChange, ...other }) {
  const handleChange = useOnChange(onChange);
  return <textarea onChange={handleChange} {...other} />
}
