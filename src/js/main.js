'use strict';

// CONSTANTES
const favorites = document.querySelector('.js-favorites');
const btn = document.querySelector('.js-btn');
const seriesContainer = document.querySelector('.js-container');
const msgError = document.querySelector('.js-msg-error');
const inputSearch = document.querySelector('.js-input-search');

// VARIABLES
let series = [];
let fav = [];

fav = JSON.parse(localStorage.getItem('fav')) || []; //coge datos o arrays, porque daba fallo. fav coge directamente el array de la constante let fav porque ya se generan las series ahí.

// FUNCIONES

function searchInfo(event) {
  if (event) {
    event.preventDefault();
  }
  const inputText = inputSearch.value.trim(); //elimina espacios en blanco en los extremos de los string
  if (inputText === '') {
    msgError.innerHTML = 'Esa serie no la he visto 👀';
    return;
  }

  fetch(`https://api.tvmaze.com/search/shows?q=${inputText}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('No consigo encontrarlo...'); // Le dice al ordena que algo está roto y esto lo para.
      }
      return response.json();
    })
    .then((dataApi) => {
      series = dataApi;
      msgError.innerHTML = '';
      renderSerieList(dataApi);
    })
    .catch((error) => {
      msgError.innerHTML = error.message;
    });
}

function renderSerie(oneSerie, flag) {
  const imageSrc = oneSerie.show.image
    ? oneSerie.show.image.original
    : 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

  let html = `
    <div class="card__serie-container js-ulElements" id="${oneSerie.show.id}">
      <h2 class="serie__title">${oneSerie.show.name}</h2>
      <ul>
        <li class="js-liElements">
          <img src="${imageSrc}" alt="${oneSerie.show.name}" title="${oneSerie.show.name}" />
        </li>
      </ul>`;
  if (flag === 'flagFav') {
    html += `<span class="remove-x" data-id="${oneSerie.show.id}">X</span>`;
  }
  html += `</div>`;
  return html;
}

function renderSerieList(listSeries) {
  const fragment = document.createDocumentFragment(); // Es como un contenedor en blano donde poner las series antes de ponerlas en el contenedor definitivo.
  for (const oneSerie of listSeries) {
    const serieElement = document.createElement('div');
    serieElement.innerHTML = renderSerie(oneSerie);
    fragment.appendChild(serieElement);
  }
  seriesContainer.innerHTML = '';
  seriesContainer.appendChild(fragment);
  addEventsToSerie();
}

function renderSeriesFav(favSeries) {
  favorites.innerHTML = '';
  for (const oneSerie of favSeries) {
    favorites.innerHTML += renderSerie(oneSerie, 'flagFav');
  }
}

// AÑADIR SERIES FAVORITAS
function handleClickId(event) {
  const idSerieClick = parseInt(event.currentTarget.id);

  const foundSerie = series.find(
    (oneSerie) => oneSerie.show.id === idSerieClick
  );

  const serieFavIndex = fav.findIndex(
    (oneSerie) => oneSerie.show.id === idSerieClick
  );

  if (serieFavIndex === -1) {
    fav.push(foundSerie);
    event.currentTarget.classList.add('add__to-fav');
  } else {
    fav.splice(serieFavIndex, 1); //elimina, agrega o sustituye en el array
    event.currentTarget.classList.remove('add__to-fav');
  }

  renderSeriesFav(fav, 'flagFav');
  addEventsToXFav();
  localStorage.setItem('fav', JSON.stringify(fav));
}

// EVENTOS
function addEventsToSerie() {
  const allSeries = document.querySelectorAll('.js-ulElements');
  for (const oneSerie of allSeries) {
    oneSerie.addEventListener('click', handleClickId);
   
  }
}

//Para escuchar sobre las X
function addEventsToXFav() {
  const allSeries = document.querySelectorAll('.remove-x');
  for (const removeX of allSeries) {
    removeX.addEventListener('click', handleRemoveFav);
  }
}

btn.addEventListener('click', searchInfo);
inputSearch.addEventListener('input', () => {
  msgError.innerHTML = '';
});
inputSearch.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchInfo(event);
  }
});

//Para quitar las series de FAV
function handleRemoveFav(event) {
  event.preventDefault();
  const idToX = parseInt(event.currentTarget.getAttribute(`data-id`));
  const serieIdex = fav.findIndex((oneSerie) => oneSerie.show.id === idToX);
  fav.splice(serieIdex, 1);
  renderSeriesFav(fav);
  addEventsToXFav();
  localStorage.setItem('fav', JSON.stringify(fav));
}

// Cargar las series favoritas almacenadas en localStorage al iniciar la página
renderSeriesFav(fav);
addEventsToXFav();
