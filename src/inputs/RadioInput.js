import React from 'react';
import useOnChange, { useOnChecked } from './useOnChange';

export default function RadioInput({ onChange, choices, ...other }) {
  const handleChange = useOnChange(onChange);
  const chkValue = typeof other.value !== 'boolean' ? other.value : (
    other.value ? 'Yes' : 'No'
  );

  return (
    <div className="Radio">
      {choices.map((choice) => (
        <label key={choice}>
          <input {...other} type="radio" value={choice} checked={chkValue === choice} onChange={handleChange} />
          <span>{choice}</span>
        </label>
      ))}
    </div>
  );
}

export function CheckInput({ onChange, label, ...other }) {
  const handleChange = useOnChecked(onChange);
  const selected = Boolean(other.value);

  return (
    <div className="Radio">
      <label>
        <input {...other} type="checkbox" checked={selected} onChange={handleChange} />
        <span>{label}</span>
      </label>
    </div>
  )
}