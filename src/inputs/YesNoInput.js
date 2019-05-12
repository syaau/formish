import React, { useCallback } from 'react';
import RadioInput from './RadioInput';

const choices = ['Yes', 'No'];

export default function YesNoInput({ onChange, ...other }) {
  const booleanOnChange = useCallback((name, v) => {
    onChange(name, v === 'Yes');
  }, [onChange]);

  return (
    <RadioInput {...other} onChange={booleanOnChange} choices={choices} />
  );
}
