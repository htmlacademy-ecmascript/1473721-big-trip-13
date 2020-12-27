import {PointField} from "../mock/task.js";
import AbstractView from "./abstract.js";

const createPoint = ({type = PointField.TYPE_POINT.TAXI,
  city = ` `,
  price = `0`,
  day,
  uberPrice,
  favorite}) => {

  const getFavorite = (state) => {
    let result = ``;
    // eslint-disable-next-line no-unused-expressions
    state ? result = `event__favorite-btn--active` : result = ``;
    return result;
  };

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="2019-03-18">${day}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${city}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T10:30">10:30</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time>
      </p>
      <p class="event__duration">30M</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      <li class="event__offer">
        <span class="event__offer-title">Order Uber</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${uberPrice}</span>
      </li>
    </ul>
    <button class="event__favorite-btn ${getFavorite(favorite)}" type="button">
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

export default class PointView extends AbstractView {
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

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
    this.getElement().querySelector(`.event__favorite-btn`).classList.toggle(`event__favorite-btn--active`);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
