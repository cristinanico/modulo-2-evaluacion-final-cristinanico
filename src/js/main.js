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

const serieLocalStorage = JSON.parse(localStorage.getItem('fav')) || []; //coge datos o arrays, porque daba fallo.

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
        throw new Error('No consigo encontrarlo...'); // google, preguntar bien. Creo que le dice al ordena que algo está roto y esto lo para.
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

function renderSerie(oneSerie) {
  const imageSrc = oneSerie.show.image
    ? oneSerie.show.image.original
    : 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

  return `
    <div class="card__serie-container">
      <h2 class="serie__title">${oneSerie.show.name}</h2>
      <ul id="${oneSerie.show.id}" class="js-ulElements">
        <li class="js-liElements">
          <img src="${imageSrc}" alt="${oneSerie.show.name}" title="${oneSerie.show.name}" />
        </li>
      </ul>
    </div>
  `;
}

function renderSerieList(listSeries) {
  const fragment = document.createDocumentFragment(); // busqué en google y me decía que añadiera un fragmento, pero no lo entiendo.
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
    favorites.innerHTML += renderSerie(oneSerie);
    // Va aquí el poner el fondo de diferente color?
  }
}

// AÑADIR SERIES FAVORITAS
function handleClickId(event) {
  const idSerieClick = parseInt(event.currentTarget.id);

  const foundSerie = series.find((oneSerie) => oneSerie.show.id === idSerieClick);

  const serieFavIndex = fav.findIndex((oneSerie) => oneSerie.show.id === idSerieClick);

  if (serieFavIndex === -1) {
    fav.push(foundSerie);
  } else {
    fav.splice(serieFavIndex, 1); //elimina, agrega o sustituye en el array
  }
  
  renderSeriesFav(fav);
  localStorage.setItem('fav', JSON.stringify(fav));
}

// EVENTOS
function addEventsToSerie() {
  const allSeries = document.querySelectorAll('.js-ulElements');
  for (const oneSerie of allSeries) {
    oneSerie.addEventListener('click', handleClickId);
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

// Cargar las series favoritas almacenadas en localStorage al iniciar la página
renderSeriesFav(serieLocalStorage);
