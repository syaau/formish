import { useMemo } from 'react';
import process from './process';

export default function useMarkDown(source, structure, data = null) {
  const markdown = useMemo(() => {
    const r = structure.reduce((res, s) => {
      res.structure[s.name] = true;
      res.data[s.name] = s.sample;
      return res;
    }, { structure: {}, data: {}});

    return process(source, data || r.data, r.structure);
  }, [source, structure, data]);

  return markdown;
}
