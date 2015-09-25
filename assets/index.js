import getAstrologySign from 'horoscope/astrology-sign';

const BASE_URL = 'http://www.huffingtonpost.com/horoscopes/astrology/';

export default function() {
  let sign = getAstrologySign(CD.param('birthday'));

  CD.getCORS(BASE_URL + sign, function (text) {
    let doc = document.implementation.createHTMLDocument('horoscope');
    doc.documentElement.innerHTML = text;

    let todaysHoroscope = CD.$('#dailyScope .horRiverBody', doc)[1];
    let horoscope = todaysHoroscope.querySelectorAll('p')[0].innerHTML;

    document.getElementById('mi_size_container').innerHTML = `<h1>${sign}</h1><p>${horoscope}</p>`;
  });
}
