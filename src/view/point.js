import {PointType} from "../mock/task.js";
// import AbstractView from "./abstract.js";
import {formDate, getDuration} from "../utils/task.js";
import Smart from "./smart.js";

const createOffersList = (offers) => {
  if (offers) {
    return offers.reduce((acc, offer) => {

      acc += `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`;

      return acc;
    }, ``);
  } else {
    return ``;
  }
};

const isFavorite = (favorite) => {
  return favorite ? `event__favorite-btn--active` : ``;
};

const createPoint = ({
  type = PointType.TAXI,
  price = `0`,
  options,
  destination,
  favorite,
  dateFrom,
  dateTo
}) => {

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${formDate(dateFrom, `YYYY-MM-DD`)}">${formDate(dateFrom, `MMM DD`)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${formDate(dateFrom, `YYYY-MM-DDTHH:mm`)}">${formDate(dateFrom, `HH:mm`)}</time>
        &mdash;
        <time class="event__end-time" datetime="${formDate(dateTo, `YYYY-MM-DDTHH:mm`)}">${formDate(dateTo, `HH:mm`)}</time>
      </p>
      <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${createOffersList(options)}
    </ul>
    <button class="event__favorite-btn ${isFavorite(favorite)}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class PointView extends Smart {
  constructor(point) {
    super();
    this._point = point;
    this._element = null;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  getTemplate() {
    return createPoint(this._point);
  }

  toggleFavorite() {
    let state = this._point.favorite;
    // eslint-disable-next-line no-unused-expressions
    state === true ? this._point.favorite = false : this._point.favorite = true;
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      favorite: this._point.favorite ? false : true
    });
    this._callback.favoriteClick(this._point);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  restoreHandlers() {
    this.setEditClickHandler(this._callback.editClick);
    this.setFavoritesClickHandler(this._callback.favoriteClick);
  }
}
