export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getPhoto = (photos) => {
  let imgElement = ``;
  for (let i = 0; i < photos.length; i++) {
    imgElement += `<img class="event__photo" src="${photos[i]}" alt="Event photo">`;
  }
  return imgElement;
};

export const getOffers = (options) => {
  let offersElement = ``;
  for (let i = 0; i < options.length; i++) {
    offersElement += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${options[i]}-1" type="checkbox"
      name="event-offer-${options[i]}" checked>
    <label class="event__offer-label" for="event-offer-${options[i]}-1">
      <span class="event__offer-title">${options[i]}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${getRandomInteger(0, 100)}</span>
    </label>
  </div>`;
  }
  return offersElement;
};
