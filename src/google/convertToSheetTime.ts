// timezone offset calculation at older date is slightly skewed by few seconds, so using more recent date
// to calculate time zone offset
const timeZoneOffset = new Date('2020-01-01').getTime() - new Date('2020-01-01 00:00').getTime();
const googleSheetTimeDiff = new Date('1899-12-30').getTime() - timeZoneOffset;

export function convertToSheetTime(time: Date | number) {
  if (typeof time !== 'number') {
    time = time.getTime();
  }
  return (time - googleSheetTimeDiff) / 86400000;
}
