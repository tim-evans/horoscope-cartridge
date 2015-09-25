const BASE_URL = 'http://www.huffingtonpost.com/horoscopes/astrology/';

function getAstrologySign(date) {
  let birthday = moment(date);
  let year = birthday.year();

  if (birthday.isBetween([year, 2, 21], [year, 3, 20], 'day')) {
    return 'aries';
  } else if (birthday.isBetween([year, 3, 20], [year, 4, 21], 'day')) {
    return 'taurus';
  } else if (birthday.isBetween([year, 4, 21], [year, 5, 21], 'day')) {
    return 'gemini';
  } else if (birthday.isBetween([year, 5, 21], [year, 6, 23], 'day')) {
    return 'cancer';
  } else if (birthday.isBetween([year, 6, 23], [year, 7, 23], 'day')) {
    return 'leo';
  } else if (birthday.isBetween([year, 7, 23], [year, 8, 23], 'day')) {
    return 'virgo';
  } else if (birthday.isBetween([year, 8, 23], [year, 9, 23], 'day')) {
    return 'libra';
  } else if (birthday.isBetween([year, 9, 23], [year, 10, 22], 'day')) {
    return 'scorpio';
  } else if (birthday.isBetween([year, 10, 22], [year, 11, 22], 'day')) {
    return 'sagittarius';
  } else if (birthday.isBetween([year, 11, 22], [year + 1, 0], 'day') ||
             birthday.isBetween([year, 0], [year, 0, 19], 'day')) {
    return 'capricorn';
  } else if (birthday.isBetween([year, 0, 20], [year, 1, 19], 'day')) {
    return 'aquarius';
  } else if (birthday.isBetween([year, 1, 19], [year, 2, 21], 'day')) {
    return 'pisces';
  }
}

export default function() {
  let sign = getAstrologySign(MI.options.birthday);

  CD.getCORS(BASE_URL + sign, function (text) {
    let doc = document.implementation.createHTMLDocument('horoscope');
    doc.documentElement.innerHTML = text;

    let todaysHoroscope = CD.$('#dailyScope .horRiverBody', doc)[1];
    let horoscope = todaysHoroscope.querySelectorAll('p')[0].innerHTML;

    document.getElementById('mi_size_container').innerHTML = horoscope;
  });
}
