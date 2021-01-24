import he from "he";
import {PointType, pointTypeResource, PointField} from "../mock/task.js";
import Smart from "./smart.js";
import {getOfferId} from "../utils/render.js";
import {formDate} from "../utils/task.js";


import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createOffersList = (selectedOffers, offers, id) => {
  return offers.reduce((acc, {title, price}) => {

    const checked = selectedOffers.some((selectedOffer) => selectedOffer.title.toLowerCase() === title.toLowerCase());
    const checkedValue = checked ? `checked` : ``;
    const offerId = getOfferId(title, id);

    acc += `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offerId}" type="checkbox" name="event-offer-${title}" ${checkedValue}>
      <label class="event__offer-label" for="${offerId}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`;

    return acc;
  }, ``);
};

const createEventsTypeList = (events, selectedEvent, id) => {
  return events.reduce((acc, event) => {

    const checkedValue = event === selectedEvent ? `checked` : ``;

    acc += `<div class="event__type-item">
    <input id="event-type-${event}-${id}" class="event__type-input  visually-hidden" type="radio"
      name="event-type" value="${event}" ${checkedValue}>
    <label class="event__type-label  event__type-label--${event}" for="event-type-${event}-${id}">${pointTypeResource[event]}</label>
    </div>`;

    return acc;
  }, ``);
};

const createDestinitionList = (cityes) => {
  return cityes.reduce((acc, city) => {

    acc += `<option value="${city}"></option>`;

    return acc;
  }, ``);
};

const createEditingPointElement = ({type = PointType.TAXI,
  city = ` `,
  id = `1`,
  dateFrom,
  dateTo,
  price = `0`,
  options: selectedOffers}, offers, destination) => {

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png"
          alt="Event type icon">
      </label>
      <input class="event__type-toggle visually-hidden" id="event-type-toggle-${id}" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${createEventsTypeList(Object.values(PointType), type, id)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${id}">
       ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${id}" type="text"
        name="event-destination" value="${city}" list="destination-list-${id}">
      <datalist id="destination-list-${id}">
        ${createDestinitionList(PointField.CITY_POINT)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">From</label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text"
        name="event-start-time" value="${formDate(dateFrom, `DD/MM/YY HH:mm`)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">To</label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text"
        name="event-end-time" value="${formDate(dateTo, `DD/MM/YY HH:mm`)}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${id}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price"
        value="${price}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${createOffersList(selectedOffers, offers, id)}
      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
    </section>
  </section>
</form>
</li>`;
};

export default class EditPointView extends Smart {
  constructor(point, offersModel, destinationsModel) {
    super();
    this._point = point;
    this._element = null;
    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._formSubmitClickHandler = this._formSubmitClickHandler.bind(this);
    this._formCancelClickHandler = this._formCancelClickHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._offerClickHandler = this._offerClickHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._availableOffers = this.getElement().querySelectorAll(`.event__offer-checkbox`);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  getTemplate() {
    return createEditingPointElement(this._point, this.getOffersByType(), this.getDistinationByType());
  }

  getOffersByType() {
    const offerByType = this._offersModel.getOffers().find((offer) => offer.type === this._point.type);

    if (offerByType) {
      return offerByType.offers;
    }

    return [];
  }

  getDistinationByType() {
    const destinitionByType = this._destinationsModel.getDestinations().find((destination) => destination.name === this._point.city);

    if (destinitionByType) {
      return destinitionByType;
    }

    return [];
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      dateFrom: new Date(Date.parse(userDate)).toISOString()
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: new Date(Date.parse(userDate)).toISOString()
    });
  }

  _setDatepicker() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    this._datepickerFrom = flatpickr(
        this.getElement().querySelector(`input[name="event-start-time"]`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          [`time_24hr`]: true,
          maxDate: this._point.dateTo,
          defaultDate: this._point.dateFrom,
          onChange: this._dateFromChangeHandler
        }
    );
    this._datepickerFrom = flatpickr(
        this.getElement().querySelector(`input[name="event-end-time"]`),
        {
          enableTime: true,
          [`time_24hr`]: true,
          dateFormat: `d/m/y H:i`,
          minDate: this._point.dateFrom,
          defaultDate: this._point.dateTo,
          onChange: this._dateToChangeHandler
        }
    );
  }

  _offerClickHandler() {
    const checkedOffers = this.getElement().querySelectorAll(`.event__available-offers .event__offer-checkbox:checked`);
    const checkedOffersIds = Array.from(checkedOffers).map(({id}) => id);
    const offersByType = this.getOffersByType();

    const options = offersByType.filter(({title}) => {
      return checkedOffersIds.some((checkedOffersId) => checkedOffersId === getOfferId(title, this._point.id));
    });

    this.updateData({
      options
    });
  }

  reset(point) {
    this.updateData(point);
  }

  _setInnerHandlers() {
    const element = this.getElement();

    element.querySelectorAll(`.event__type-input`).forEach((typePoint) => typePoint.addEventListener(`change`, this._typeChangeHandler));
    element.querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChangeHandler);
    element.querySelectorAll(`.event__offer-checkbox`).forEach((item) => item.addEventListener(`change`, this._offerClickHandler));
    element.querySelector(`.event__input--price`).addEventListener(`input`, this._priceChangeHandler);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
    });
    this._offerClickHandler();
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      city: evt.target.value
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    const priceValue = parseInt(evt.target.value);
    if (!isNaN(priceValue)) {
      this.updateData({
        price: priceValue
      }, true);
    } else {
      evt.target.setCustomValidity(`Insert the number`);
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitClickHandler(this._callback.submitClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCancelClickHandler(this._callback.cancelClick);
    this._setDatepicker();
  }

  static parse(data) {
    data = Object.assign({}, data);
    return data;
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  _formSubmitClickHandler(evt) {
    evt.preventDefault();
    this._callback.submitClick(EditPointView.parse(this._point));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditPointView.parse(this._point));
  }

  _formCancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.cancelClick();
  }

  _formKeyDownHandler(evt) {
    evt.preventDefault();
    this._callback.keyDown();
  }

  // setChangePriceHandler(callback) {
  //   this._callback.priceChange = callback;
  //   console.log(this.getElement().querySelector(`.event__input--price`));
  //   this.getElement().querySelector(`.event__input--price`).addEventListener(`onchange`, this._priceChangeHandler);
  // }

  setSubmitClickHandler(callback) {
    this._callback.submitClick = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitClickHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`form`).addEventListener(`reset`, this._formDeleteClickHandler);
  }

  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
    this.getElement().querySelector(`form`).querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formCancelClickHandler);
  }

  setKeyDownHandler(callback) {
    this.callback.keyDown = callback;
    document.addEventListener(`keydown`, this._formKeyDownHandler);
  }
}
