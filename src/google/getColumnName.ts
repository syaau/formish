import { Fields } from './types';

export function getFirstColumn(fields: Fields) {
  return Object.values(fields).reduce((res, field) => field.column < res ? field.column : res, Number.MAX_VALUE);
}

export function getLastColumn(fields: Fields) {
  return Object.values(fields).reduce((res, field) => field.column > res ? field.column : res, Number.MIN_VALUE);
}

// column index starts from 0, 0 = A, 1 = B, ..., 25 = Z, 26 = AA, 27 = AB, ...
export function getColumnName(idx: number) {
  let num = idx + 1;
  let name = '';
  do {
    num -= 1;
    name = String.fromCharCode(65 + (num % 26)) + name;
    num = (num / 26) | 0;
  } while (num > 0);
  return name;
}

export function extractColRow(cellName: string): [string, number] {
  // Assuming that cellNames can't have more than 2 column characters AA, AB, ....
  let col = cellName.charAt(0);
  let pos = 1;
  const secondChar = cellName.charAt(pos);
  if (secondChar >= 'A') {
    col += secondChar;
    pos += 1;
  }

  return [col, parseInt(cellName.substr(pos)) - 1];
}

export function getMinMax(fields: Fields) {
  let min = fields[0].column;
  let max = min;
  for (let i = 1; i < fields.length; i++) {
    const v = fields[i].column;
    if (v < min) min = v;
    if (v > max) max = v;
  }

  return [min, max];
}
