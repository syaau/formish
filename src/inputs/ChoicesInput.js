import React from 'react';
import RadioInput from './RadioInput';
import SelectInput from './SelectInput';

export default function ChoicesInput({ onChange, choices, ...other }) {
  const list = choices.split(',').map(p => p.trim()).filter(p => p.length > 0);

  if (list.length === 0) {
    return <span>No choice available</span>;
  } else if (list.length < 4) {
    return <RadioInput onChange={onChange} choices={list} {...other} />;
  } else {
    return <SelectInput onChange={onChange} choices={list} {...other} />;
  }
}

ChoicesInput.defaultProps = {
  choices: '',
}