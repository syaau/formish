import React from 'react';
import useOnChange from './useOnChange';

export default function RadioInput({ name, onChange, choices }) {
  const handleChange = useOnChange(onChange);

  return (
    <div className="Radio">
      {choices.map((choice) => (
        <label key={choice}>
          <input type="radio" name={name} value={choice} onChange={handleChange} />
          <span>{choice}</span>
        </label>
      ))}
    </div>
  );
}
