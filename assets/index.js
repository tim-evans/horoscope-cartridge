import getAstrologySign from 'horoscope/lib/astrology-sign';

const BASE_URL = 'http://www.huffingtonpost.com/horoscopes/astrology/';

function $(selector) {
  if (selector.split(' ').length === 1 && selector.indexOf('#') === 0) {
    return document.getElementById(selector.slice(1));
  }

  let nodes = Array.prototype.slice.call(document.querySelectorAll(selector));

  return nodes.map(function (node) {
    node.$ = node.querySelectorAll;
    return node;
  });
}

function HTML(text) {
  let doc = document.implementation.createHTMLDocument('horoscope');
  doc.documentElement.innerHTML = text;

  this.document = doc;
}

HTML.prototype.$ = function (selector) {
  if (selector.split(' ').length === 0 && selector.indexOf('#') === 0) {
    return this.document.getElementById(selector.slice(1));
  }

  let nodes = Array.prototype.slice.call(this.document.querySelectorAll(selector));

  return nodes.map(function (node) {
    node.$ = node.querySelectorAll;
    return node;
  });
}

export default function() {
  let sign = getAstrologySign(CD.param('birthday'));

  CD.getCORS(BASE_URL + sign, function (text) {
    let html = new HTML(text);
    let todaysHoroscope = html.$('#dailyScope .horRiverBody')[1];
    let horoscope = todaysHoroscope.$('p')[0].innerHTML;

    $('#mi_size_container').innerHTML = `<h1>${sign}</h1><p>${horoscope}</p>`;
  });
}
