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
      series = dataApi.series;
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
  html += `<ul id= ${oneSerie.show.id} class="js-ul-item">`;
  if (oneSerie.show.image) {
    html += `<img src="${oneSerie.show.image.original}" alt="${oneSerie.show.name}" title="${oneSerie.show.name}"/>`;
  } else {
    html += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?
        text=TV" alt="${oneSerie.show.name}" title="${oneSerie.show.name}" class=""/>`;
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
  addEventsToSeries();
}

function handleClick(event) {
  const idSerieClick = event.currentTarget.id;
  const foundSerie = series.find((item) => (item.id = idSerieClick));
  console.log(foundSerie);
}

function addEventsToSeries() {
  const allSeries = document.querySelectorAll('.js-ul-item');
  for (const item of allSeries) {
    item.addEventListener('click', handleClick);
  }
}

//Añadir series FAV Usar DOM???

//Pintar FAV
// function renderFav(oneSerie) {
//   let html = '';
//   html += `<article class="js-container-fav" id="${oneSerie.show.id}">`;
//   html += '<section>';
//   html += oneSerie.show.name;
//   html += '</section>';
//   html += `<article>`;
//   html += '<div>';
//   if (oneSerie.show.image) {
//     html += `<img src="${oneSerie.show.image.original}" alt="${oneSerie.show.name}" title="${oneSerie.show.name}"/>`;
//   } else {
//     html += `<img src="https://via.placeholder.com/210x295/ffffff/666666/?
//           text=TV" alt="${oneSerie.show.name}" title="${oneSerie.show.name}"/>`;
//   }
//   html += '</div>';
//   html += '</article>';
//   html += '</article>';
//   return html;
// }

// function handleFav() {
//   let html = '';
//   for (let index = 0; index < fav.length; index += 1) {
//     html += renderFav(fav[index]);
//   }
//   favorites.innerHTML = html;
// }

// handleFav();

// EVENTOS
btn.addEventListener('click', searchInfo);

/*evento click sobre la tarjeta de la serie, asociar un evento click a cada 
una de las tarjetas series. querySelectorAll a las ul, luego bucle sobre cada paleta y le añado el evento click
con eventTarget obtengo a la que le di click
de aquí obtengo el id y lo añado dentro del ul*/
