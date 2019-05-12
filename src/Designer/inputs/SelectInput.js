import React from 'react';
import useOnChange from './useOnChange';

export default function SelectInput({ name, value, onChange, choices }) {
  const handleChange = useOnChange(onChange);

  return (
    <select name={name} value={value} onChange={handleChange}>
      {choices.map((choice) => (
        <option key={choice}>{choice}</option>
      ))}
    </select>
  );
}
