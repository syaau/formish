import React from 'react';
import RadioInput from './RadioInput';
import SelectInput from './SelectInput';

export default function ChoicesInput({ name, onChange, choices }) {
  const list = choices.split(',').map(p => p.trim()).filter(p => p.length > 0);

  if (list.length === 0) {
    return <span>No choice available</span>;
  } else if (list.length < 4) {
    return <RadioInput name={name} onChange={onChange} choices={list} />;
  } else {
    return <SelectInput name={name} onChange={onChange} choices={list} />;
  }
}

ChoicesInput.defaultProps = {
  choices: '',
}