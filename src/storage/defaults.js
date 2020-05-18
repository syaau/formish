
export const defaultStructure = [
  { name: 'PN', type: 'Text', searchable: true },
  { name: 'DATE', type: 'Date', searchable: true },
  { name: 'NAME', type: 'Text', searchable: true },
  { name: 'DOB', type: 'Date' },
  { name: 'GENDER', type: 'Choices', choices: 'Male,Female' },
  { name: 'MARRIED', type: 'Yes/No' },
  { name: 'DOCTOR', type: 'Text' },
  { name: 'DIAGNOSIS', type: 'List' },
  { name: 'CONDITION', type: 'Text' },
  { name: 'MEDICATIONS', type: 'List' },
];

export const defaultMarkDown = (`
# Report
### {{dddd}}, {{Do}} {{MMM}}, {{YYYY}}

Report for {{Mr}} {{NAME}}. {{He}} has been diagnosed with **{{DIAGNOSIS}}**.
{{His}} condition is {{CONDITION}}.

{{He}} is {{AGE}} old as per our records.

{{MEDICATIONS:1.}}

&nbsp;${'  '}
................................${'  '}
{{DOCTOR}}
`);
