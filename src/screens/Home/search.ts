type Record = {
  [attr: string]: string,
};
type Field = { name: string };

export function searchGeneral(word: string) {
  return (record: Record, fields: Field[]) => {
    const keywords = fields.map(f => record[f.name]).join('|');
    return keywords.toLowerCase().indexOf(word) >= 0;
  }
}

function startsWith(text: string, word: string) {
  if (!text) return false;
  return text.toLowerCase().startsWith(word);
}

export function searchHead(word: string) {
  return (record: Record, fields: Field[]) => {
    return fields.reduce((res, f) => res || startsWith(record[f.name], word), false);
  }
}

function endsWith(text: string, word: string) {
  if (!text) return false;
  return text.toLowerCase().endsWith(word);
}

export function searchTail(word: string) {
  return (record: Record, fields: Field[]) => {
    return fields.reduce((res, f) => res || endsWith(record[f.name], word), false);
  }
}

function exact(text: string, word: string) {
  if (!text) return false;
  return text.toLowerCase() === word;
}

export function searchExact(word: string) {
  return (record: Record, fields: Field[]) => {
    return fields.reduce((res, f) => res || exact(record[f.name], word), false);
  }
}
