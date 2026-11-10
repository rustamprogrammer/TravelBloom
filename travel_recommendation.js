'use strict';
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const panel = document.getElementById('recommendations');
const grid = document.getElementById('results-grid');
const status = document.getElementById('search-status');
const count = document.getElementById('result-count');
let requestNumber = 0;
let dataPromise;

function getTravelData() {
  if (!dataPromise) {
    dataPromise = fetch('travel_recommendation_api.json?v=2', { cache: 'no-store' })
      .then(response => {
        if (!response.ok) throw new Error('Unable to load destinations');
        return response.json();
      })
      .catch(error => { dataPromise = undefined; throw error; });
  }
  return dataPromise;
}

function categoryFor(value) {
  const keyword = value.trim().toLowerCase();
  if (/^(beach|beaches)$/.test(keyword)) return 'beaches';
  if (/^(temple|temples)$/.test(keyword)) return 'temples';
  if (/^(country|countries)$/.test(keyword)) return 'countries';
  return null;
}

function createCard(place) {
  const article = document.createElement('article');
  article.className = 'result-card';
  const image = document.createElement('img');
  image.src = place.imageUrl;
  image.alt = place.imageAlt;
  image.width = 600;
  image.height = 400;
  const body = document.createElement('div');
  body.className = 'card-body';
  const location = document.createElement('div');
  location.className = 'card-country';
  location.textContent = place.location;
  const title = document.createElement('h3');
  title.textContent = place.name;
  const description = document.createElement('p');
  description.textContent = place.description;
  const credit = document.createElement('a');
  credit.className = 'photo-credit';
  credit.href = place.creditUrl;
  credit.textContent = 'Photography: Unsplash';
  body.append(location, title, description, credit);
  article.append(image, body);
  return article;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const thisRequest = ++requestNumber;
  const keyword = input.value.trim().toLowerCase();
  panel.hidden = false;
  grid.replaceChildren();
  count.textContent = '';
  status.textContent = 'Finding your next destination…';
  try {
    const data = await getTravelData();
    if (thisRequest !== requestNumber) return;
    const category = categoryFor(keyword);
    const places = category ? data[category] : Object.values(data).flat().filter(place =>
      `${place.name} ${place.location}`.toLowerCase().includes(keyword));
    if (!places.length) {
      status.textContent = 'No matches yet. Try beach, temple or country.';
      return;
    }
    status.textContent = `Discover ${category || 'places matching “' + input.value.trim() + '”'}.`;
    count.textContent = `${places.length} recommendations`;
    grid.append(...places.map(createCard));
  } catch {
    if (thisRequest === requestNumber) status.textContent = 'Destinations could not load. Check your connection and search again.';
  }
});

document.getElementById('clear-button').addEventListener('click', () => {
  ++requestNumber;
  input.value = '';
  grid.replaceChildren();
  count.textContent = '';
  status.textContent = '';
  panel.hidden = true;
  input.focus();
});
