import React from 'react';
import useOnChange from './useOnChange';

export default function SelectInput({ onChange, choices, ...other }) {
  const handleChange = useOnChange(onChange);

  return (
    <select onChange={handleChange} {...other}>
      {choices.map((choice) => (
        <option key={choice}>{choice}</option>
      ))}
    </select>
  );
}
