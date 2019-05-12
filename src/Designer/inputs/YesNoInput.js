import React, { useCallback } from 'react';
import RadioInput from './RadioInput';

const choices = ['Yes', 'No'];

export default function YesNoInput({ name, onChange }) {
  const booleanOnChange = useCallback((name, v) => {
    onChange(name, v === 'Yes');
  }, [onChange]);

  return (
    <RadioInput name={name} onChange={booleanOnChange} choices={choices} />
  );
}
