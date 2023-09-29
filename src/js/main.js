'use strict';

//CONSTANTES
const favorites = document.querySelector('.js-favorites');
const btn = document.querySelector('.js-btn');
const seriesContainer = document.querySelector('.js-container');
const msgError = document.querySelector('.js-msg-error');

//VARIABLES
let series = [];
let fav = [];

// FUNCIONES

//El fetch tiene que pintar una serie en el HTML
function searchInfo(event) {
  event.preventDefault();
  const inputText = document.querySelector('.js-input-search').value;
  fetch(`https://api.tvmaze.com/search/shows?q=${inputText}`)
    .then((reponse) => reponse.json())
    .then((dataApi) => {
      series = dataApi;
      if (inputText === '') {
        msgError.innerHTML = 'Esa serie no la he visto 👀';
      } else {
        msgError.innerHTML = '';
        renderSerieList(dataApi);
      }
    });
}

//Función para pintar UNA serie en el HTML, renderSerie
// USAR DOM EN EL HTML DE ESTA FUNCIÓN
function renderSerie(oneSerie) {
  let html = '';
  html += `<div class ="" id="">`;
  html += '<h2>';
  html += oneSerie.show.name;
  html += '</h2>';
  html += '<div>';
  if (oneSerie.show.image) {
    html += `<img src="${oneSerie.show.image.original}" alt="${oneSerie.show.name}" title="${oneSerie.show.name}" class=""/>`;
  } else {
    html += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?
        text=TV" alt="${oneSerie.show.name}" title="${oneSerie.show.name}" class=""/>`;
  }
  html += '</div>';
  html += '</div>';
  return html;
}

//Funcion renderSerieList para pintar una serie en el HTML
// function renderSerieList(listSeries) {
//   for (const oneSerie of listSeries) {
//     seriesContainer.innerHTML += renderSerie(oneSerie);
//   }
// }

function renderSerieList(listSeries) {
  // if (inputText === '') {
  //   msgError.innerHTML = 'Esa serie no la he visto 👀';
  // } else {
  seriesContainer.innerHTML = '';
  for (const oneSerie of listSeries) {
    seriesContainer.innerHTML += renderSerie(oneSerie);
  }
}

//Añadir series FAV Usar DOM???

//Pintar FAV
function renderFav(oneSerie) {
  let html = '';
  html += `<article class="js-container-fav" id="${oneSerie.show.id}">`;
  html += '<section>';
  html += oneSerie.show.name;
  html += '</section>';
  html += `<article>`;
  html += '<div>';
  if (oneSerie.show.image) {
    html += `<img src="${oneSerie.show.image.original}" alt="${oneSerie.show.name}" title="${oneSerie.show.name}"/>`;
  } else {
    html += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?
          text=TV" alt="${oneSerie.show.name}" title="${oneSerie.show.name}"/>`;
  }
  html += '</div>';
  html += '</article>';
  html += '</article>';
  return html;
}

function handleFav() {
  let html = '';
  for (let index = 0; index < fav.length; index += 1) {
    html += renderFav(fav[index]);
  }
  favorites.innerHTML = html;
}

handleFav();

// EVENTOS
btn.addEventListener('click', searchInfo);
