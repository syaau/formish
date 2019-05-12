import { useCallback } from 'react';

export default function useOnChange(onChange) {
  return useCallback(e => onChange(e.target.name, e.target.value), [onChange]);
}
