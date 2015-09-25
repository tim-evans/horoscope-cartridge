export default function(date) {
  let birthday = moment(date);
  let year = birthday.year();

  if (birthday.isBetween([year, 2, 20], [year, 3, 20], 'day')) {
    return 'aries';
  } else if (birthday.isBetween([year, 3, 19], [year, 4, 21], 'day')) {
    return 'taurus';
  } else if (birthday.isBetween([year, 4, 20], [year, 5, 21], 'day')) {
    return 'gemini';
  } else if (birthday.isBetween([year, 5, 20], [year, 6, 23], 'day')) {
    return 'cancer';
  } else if (birthday.isBetween([year, 6, 22], [year, 7, 23], 'day')) {
    return 'leo';
  } else if (birthday.isBetween([year, 7, 22], [year, 8, 23], 'day')) {
    return 'virgo';
  } else if (birthday.isBetween([year, 8, 22], [year, 9, 23], 'day')) {
    return 'libra';
  } else if (birthday.isBetween([year, 9, 22], [year, 10, 22], 'day')) {
    return 'scorpio';
  } else if (birthday.isBetween([year, 10, 21], [year, 11, 22], 'day')) {
    return 'sagittarius';
  } else if (birthday.isBetween([year, 11, 21], [year + 1, 0], 'day') ||
             birthday.isBetween([year, 0], [year, 0, 19], 'day')) {
    return 'capricorn';
  } else if (birthday.isBetween([year, 0, 19], [year, 1, 19], 'day')) {
    return 'aquarius';
  } else if (birthday.isBetween([year, 1, 18], [year, 2, 21], 'day')) {
    return 'pisces';
  }
}
