import {PointType, pointTypeResource} from "../const.js";
import Smart from "./smart.js";
import {getOfferId} from "../utils/render.js";
import {formDate} from "../utils/task.js";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const DEFAULT_POINT = {
  dateFrom: `2021-01-24T23:19:00.000Z`,
  dateTo: `2021-01-27T15:49:06.212Z`,
  destination: {
    description: `Amsterdam, is a beautiful city, in a middle of Eur…th a beautiful old town, middle-eastern paradise.`,
    name: `Amsterdam`,
    pictures: [
      {
        src: `http://picsum.photos/300/200?r=0.694135021107301`,
        description: `Amsterdam central station`
      }
    ]},
  favorite: false,
  options: [
    {
      title: `Choose comfort class`,
      price: 110
    }
  ],
  price: 80,
  type: `drive`,
};

const createOffersList = (selectedOffers, offers, id, isDisabled) => {
  if (selectedOffers) {
    return offers.reduce((acc, {title, price}) => {

      const checked = selectedOffers.some((selectedOffer) => selectedOffer.title.toLowerCase() === title.toLowerCase());
      const checkedValue = checked ? `checked` : ``;
      const offerId = getOfferId(title, id);

      acc += `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offerId}" type="checkbox" name="event-offer-${title}" ${checkedValue} ${isDisabled ? `disabled` : ``}>
        <label class="event__offer-label" for="${offerId}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`;

      return acc;
    }, ``);
  } else {
    return ``;
  }
};

const createEventsTypeList = (events, selectedEvent, id, isDisabled) => {
  return events.reduce((acc, event) => {

    const checkedValue = event === selectedEvent ? `checked` : ``;

    acc += `<div class="event__type-item">
    <input id="event-type-${event}-${id}" class="event__type-input  visually-hidden" type="radio"
      name="event-type" value="${event}" ${checkedValue} ${isDisabled ? `disabled` : ``}>
    <label class="event__type-label  event__type-label--${event}" for="event-type-${event}-${id}">${pointTypeResource[event]}</label>
    </div>`;

    return acc;
  }, ``);
};

const createDestinitionList = (destinations, isDisabled) => {
  return destinations.reduce((acc, destination) => {

    acc += `<option value="${destination.name}${isDisabled ? `disabled` : ``}"></option>`;

    return acc;
  }, ``);
};

const getViewEditing = (flag, isDisabled, isSaving, isDeleting) => {
  if (flag) {
    return `<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}> ${isSaving ? `Saving...` : `Save`}</button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}> ${isDeleting ? `Deleting...` : `Delete`}</button>
    <button class="event__rollup-btn" type="button" ${isDisabled ? `disabled` : ``}></button>`;
  } else {
    return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>`;
  }
};

const getPhotosList = (destination) => {
  return destination.pictures.reduce((acc, picture) => {

    acc += ` <img class="event__photo" src="${picture.src}" alt="${picture.description}">`;

    return acc;
  }, ``);
};

const getViewPhotos = (flag, destination) => {
  if (!flag) {
    return `<div class="event__photos-container">
    <div class="event__photos-tape">
    ${getPhotosList(destination)}
    </div>
  </div>`;
  } else {
    return ``;
  }
};

const createEditingPointElement = ({type = PointType.TAXI,
  id = `1`,
  dateFrom,
  dateTo,
  price = `0`,
  destination,
  options: selectedOffers}, offers, destinations, isEditViewMode, {isDisabled, isSaving, isDeleting}) => {

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png"
          alt="Event type icon">
      </label>
      <input class="event__type-toggle visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? `disabled` : ``}>

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${createEventsTypeList(Object.values(PointType), type, id, isDisabled)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${id}">
       ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${id}" type="text"
        name="event-destination" value="${destination.name}" list="destination-list-${id}" ${isDisabled ? `disabled` : ``}>
      <datalist id="destination-list-${id}">
        ${createDestinitionList(destinations, isDisabled)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">From</label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text"
        name="event-start-time" value="${formDate(dateFrom, `DD/MM/YY HH:mm`)}" ${isDisabled ? `disabled` : ``}>
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">To</label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text"
        name="event-end-time" value="${formDate(dateTo, `DD/MM/YY HH:mm`)}" ${isDisabled ? `disabled` : ``}>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${id}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price"
        value="${price}" ${isDisabled ? `disabled` : ``}>
    </div>
    ${getViewEditing(isEditViewMode, isDisabled, isSaving, isDeleting)}
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${createOffersList(selectedOffers, offers, id, isDisabled)}
      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      ${getViewPhotos(isEditViewMode, destination)}
    </section>
  </section>
</form>
</li>`;
};

export default class EditPointView extends Smart {
  constructor(offersModel, destinationsModel, isEditViewMode, point = DEFAULT_POINT) {
    super();
    this._data = point;
    this._element = null;
    this._datepickerFrom = null;
    this._datepickerTo = null;
    this._data = EditPointView.parsePointToData(this._data);

    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._isEditViewMode = isEditViewMode;

    this._isDisabled = false;
    this._isSaving = false;
    this._isDeleting = false;

    this._formSubmitClickHandler = this._formSubmitClickHandler.bind(this);
    this._formCancelClickHandler = this._formCancelClickHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
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
    // return createEditingPointElement(this._point, this.getOffersByType(), this.getDistinationByType(false), this._isEditViewMode, this._isDisabled, this._isSaving, this._isDeleting);
    return createEditingPointElement(this._data, this.getOffersByType(), this.getDistinationByType(false), this._isEditViewMode, this._data);
  }

  getOffersByType() {
    const offerByType = this._offersModel.getOffers().find((offer) => offer.type === this._data.type);
    // const offerByType = this._offersModel.getOffers().find((offer) => offer.type === this._data.type);/

    if (offerByType) {
      return offerByType.offers;
    }

    return [];
  }

  getDistinationByType(flag, value) {
    if (flag) {
      const destinitionByType = this._destinationsModel.getDestinations().find((destination) => destination.name === value);

      if (destinitionByType) {
        return destinitionByType;
      }
      return [];

    } else {
      return this._destinationsModel.getDestinations();
    }
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
          maxDate: this._data.dateTo,
          defaultDate: this._data.dateFrom,
          onChange: this._dateFromChangeHandler
        }
    );
    this._datepickerFrom = flatpickr(
        this.getElement().querySelector(`input[name="event-end-time"]`),
        {
          enableTime: true,
          [`time_24hr`]: true,
          dateFormat: `d/m/y H:i`,
          minDate: this._data.dateFrom,
          defaultDate: this._data.dateTo,
          onChange: this._dateToChangeHandler
        }
    );
  }

  _offerClickHandler() {
    const checkedOffers = this.getElement().querySelectorAll(`.event__available-offers .event__offer-checkbox:checked`);
    const checkedOffersIds = Array.from(checkedOffers).map(({id}) => id);
    const offersByType = this.getOffersByType();

    const options = offersByType.filter(({title}) => {
      return checkedOffersIds.some((checkedOffersId) => checkedOffersId === getOfferId(title, this._data.id));
      // return checkedOffersIds.some((checkedOffersId) => checkedOffersId === getOfferId(title, this._data.id));
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
    element.querySelector(`.event__input--destination`).addEventListener(`input`, this._destinationInputHandler);
    element.querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChangeHandler);
    element.querySelectorAll(`.event__offer-checkbox`).forEach((item) => item.addEventListener(`change`, this._offerClickHandler));
    element.querySelector(`.event__input--price`).addEventListener(`input`, this._priceChangeHandler);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value
    });
    this._offerClickHandler();
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    this._destinationsModel.getDestinations().forEach((element) => {
      if (element.name.includes(evt.target.value)) {
        this.updateData({
          destination: this.getDistinationByType(true, evt.target.value)
        }, true);
      }
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: this.getDistinationByType(true, evt.target.value)
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: Number(evt.target.value)
    }, true);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitClickHandler(this._callback.submitClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCancelClickHandler(this._callback.cancelClick);
    this._setDatepicker();
  }

  static parsePointToData(data) {
    return Object.assign({}, data, {
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    });
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

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
    // this._data.isDisabled = true;
    // this._data.isSaving = true;
    this._callback.submitClick(EditPointView.parseDataToPoint(this._data));
    // this._callback.submitClick(EditPointView.parseDataToPoint(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    if (this._isEditViewMode) {
      this._callback.deleteClick(EditPointView.parseDataToPoint(this._data));
      // this._callback.deleteClick(EditPointView.parseDataToPoint(this._data));
      // this._isDisabled = true;
      // this._isDeleting = true;
    } else {
      this._callback.cancelClick();
    }
  }

  _formCancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.cancelClick();
  }

  _formKeyDownHandler(evt) {
    evt.preventDefault();
    this._callback.keyDown();
  }

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
    if (this._isEditViewMode) {
      this.getElement().querySelector(`form`).querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formCancelClickHandler);
    }
  }

  setKeyDownHandler(callback) {
    this.callback.keyDown = callback;
    document.addEventListener(`keydown`, this._formKeyDownHandler);
  }
}
