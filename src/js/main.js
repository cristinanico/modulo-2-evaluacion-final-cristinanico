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
  html += `<h2>${oneSerie.show.name}</h2>`;
  html += `<ul id= ${oneSerie.show.id} class="js-ulElements">`;
  if (oneSerie.show.image) {
    html += `<li class="js-liElements"><img src="${oneSerie.show.image.original}" alt="${oneSerie.show.name}" title="${oneSerie.show.name}"/></li>`;
  } else {
    html += `<li class="js-liElements"><img src="https://via.placeholder.com/210x295/ffffff/666666/?
          text=TV" alt="${oneSerie.show.name}" title="${oneSerie.show.name}" class=""/></li>`;
  }

  html += `</ul>`;
  return html;
}

function renderSerieList(listSeries) {
  seriesContainer.innerHTML = '';
  for (const oneSerie of listSeries) {
    seriesContainer.innerHTML += renderSerie(oneSerie);
  }

  // lo pinto aquí porque antes no tiene sentido pintarlo porque no existe, vacío
  addEventsToSerie();
}

// AÑADIR SERIES FAVORITAS
function handleClickId(event) {
  const idSerieClick = parseInt(event.currentTarget.id); //porque estoy comparando string con número en id, se pasa a número con número
  console.log(idSerieClick);
  const foundSerie = series.find((oneSerie) => (oneSerie.show.id = idSerieClick)
  );
}

// EVENTOS

function addEventsToSerie() {
  const allSeries = document.querySelectorAll('.js-ulElements');
  console.log(allSeries);
  for (const oneSerie of allSeries) {
    oneSerie.addEventListener('click', handleClickId);
  }
}
btn.addEventListener('click', searchInfo);

