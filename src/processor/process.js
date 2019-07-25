import { format, distanceInWordsStrict } from 'date-fns';
import numeral from 'numeral';

const GENDER_MALE = 'Male';

const title = (Mr, Mrs, Ms) => (data) => {
  if (data.GENDER === GENDER_MALE) {
    return Mr;
  } else if (data.MARRIED) {
    return Mrs;
  } else {
    return Ms;
  }
}

const gender = (he, she) => (data) => {
  if (data.GENDER === GENDER_MALE) {
    return he;
  }
  return she;
}

const date = (fmt) => (data, param='DATE') => {
  const d = new Date(data[param] || Date.now());
  return format(d, fmt);
}

const age = () => (data, dob='DOB', now='DATE') => {
  const dobDate = new Date(data[dob] || '2010-01-01');
  const nowDate = new Date(data[now] || Date.now());

  return distanceInWordsStrict(dobDate, nowDate);
}

const specials = {
  AGE: age(),

  Mr: title('Mr.', 'Mrs.', 'Ms.'),
  He: gender('He', 'She'),
  he: gender('he', 'she'),
  HE: gender('HE', 'SHE'),
  Him: gender('Him', 'Her'),
  him: gender('him', 'her'),
  HIM: gender('HIM', 'HER'),
  His: gender('His', 'Her'),
  his: gender('his', 'her'),
  HIS: gender('HIS', 'HER'),

  DATE: date('YYYY-MM-DD'),
  TIME: date('HH:mm:ss'),
  YY: date('YY'),
  YYYY: date('YYYY'),
  A: date('A'),
  a: date('a'),
  aa: date('aa'),
  M: date('M'),
  MM: date('MM'),
  MMM: date('MMM'),
  MMMM: date('MMMM'),
  D: date('D'),
  Do: date('Do'),
  DD: date('DD'),
  d: date('d'),
  dd: date('dd'),
  ddd: date('ddd'),
  dddd: date('dddd'),
  i: date('i'),
  H: date('H'),
  HH: date('HH'),
  h: date('h'),
  hh: date('hh'),
  mm: date('mm'),
  ss: date('ss'),
}

function convert(data) {
  if (data === true) return 'Yes';
  if (data === false) return 'No';
  return data;
}

export default function process(template, data, structure) {
  // First replace all specials values from the template
  return template.replace(/{{([^}]*)}}/g, (match, first) => {
    const [field, ...params] = first.split(':');
    const special = specials[field];
    if (special) {
      return special(data, ...params);
    }

    if (structure[field]) {
      if (params[0] === '#') {
        // Use number formatting
        const fmt = params[1];
        const v = numeral(data[field]);

        return fmt ? v.format(fmt) : v.value();
      }
      // Can return a ordered/unorderd list based on the params
      else if (params[0] === '*' || /[0-9]+[.]/.test(params[0])) {
        const v = data[field] || '';
        return v.split('\n')
          .map(v => v.trim())
          .filter(v => v.length > 0)
          .map(v => `${params[0]} ${v}`)
          .join('\n');
      }
      return convert(data[field]);
    }

    return match;
  });
}
