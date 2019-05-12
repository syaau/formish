import TextInput from './TextInput';
import DateInput from './DateInput';
import ListInput from './ListInput';
import YesNoInput from './YesNoInput';
import ChoicesInput from './ChoicesInput';
import SelectInput from './SelectInput';

export {
  TextInput,
  DateInput,
  ListInput,
  YesNoInput,
  ChoicesInput,
  SelectInput,
}

export const types = [
  { id: 'Text', C: TextInput },
  { id: 'Date', C: DateInput },
  { id: 'List', C: ListInput },
  { id: 'Yes/No', C: YesNoInput },
  { id: 'Choices', C: ChoicesInput },
];