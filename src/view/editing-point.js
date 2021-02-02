import {PointType, pointTypeResource} from "../const.js";
import Smart from "./smart.js";
import {getOfferId} from "../utils/render.js";
import {formDate, getDefaultPointDates} from "../utils/task.js";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const {start: START_DATE, end: END_DATE} = getDefaultPointDates();

const DEFAULT_POINT = {
  id: `-1`,
  dateFrom: START_DATE,
  dateTo: END_DATE,
  favorite: false,
  options: [],
  price: 0,
  type: PointType.TAXI,
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

const getPhotosList = (pictures) => {
  return pictures.reduce((acc, picture) => {

    acc += ` <img class="event__photo" src="${picture.src}" alt="${picture.description}">`;

    return acc;
  }, ``);
};

const getViewPhotos = (pictures) => {
  return `<div class="event__photos-container">
    <div class="event__photos-tape">
    ${getPhotosList(pictures)}
    </div>
  </div>`;
};

const createEditingPointElement = ({type = PointType.TAXI,
  id = `1`,
  dateFrom,
  dateTo,
  price,
  destination: {name: destinationName = ``, pictures = [], description = ``} = {},
  options: selectedOffers}, offers, destinations, isEditViewMode, {isDisabled, isSaving, isDeleting}) => {

  const createOffersSection = () => {
    if (offers.length === 0) {
      return ``;
    } else {
      return ` <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${createOffersList(selectedOffers, offers, id, isDisabled)}
        </div>
      </section>`;
    }
  };

  const createDestinationsSection = () => {
    if (destinations.length === 0) {
      return ``;
    }

    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${getViewPhotos(pictures)}
    </section>`;
  };

  return `<form class="event event--edit" action="#" method="post">
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
        name="event-destination" value="${destinationName}" required list="destination-list-${id}" ${isDisabled ? `disabled` : ``}>
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
  ${createOffersSection()}
  ${createDestinationsSection()}
  </section>
</form>`;
};

export default class EditingPoint extends Smart {
  constructor(offersModel, destinationsModel, isEditViewMode = false, point = DEFAULT_POINT) {
    super();
    this._datepickerFrom = null;
    this._datepickerTo = null;
    this._data = EditingPoint.parsePointToData(point);

    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._isEditViewMode = isEditViewMode;

    this._isDisabled = false;
    this._isSaving = false;
    this._isDeleting = false;

    this._onFormSubmitClick = this._onFormSubmitClick.bind(this);
    this._onFormCancelClick = this._onFormCancelClick.bind(this);
    this._onFormDeleteClick = this._onFormDeleteClick.bind(this);
    this._onTypeChange = this._onTypeChange.bind(this);
    this._onDestinationInput = this._onDestinationInput.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
    this._onOfferClick = this._onOfferClick.bind(this);
    this._onDateFromChange = this._onDateFromChange.bind(this);
    this._onDateToChange = this._onDateToChange.bind(this);
    this._onPriceChange = this._onPriceChange.bind(this);

    this._availableOffers = this.getElement().querySelectorAll(`.event__offer-checkbox`);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  getTemplate() {
    return createEditingPointElement(this._data, this.getOffersByType(), this.getDistinationByType(false), this._isEditViewMode, this._data);
  }

  getOffersByType() {
    const offerByType = this._offersModel.getOffers().find((offer) => offer.type === this._data.type);

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

  restoreHandlers() {
    this._setInnerHandlers();
    this.onSetSubmitClick(this._callback.submitClick);
    this.onSetDeleteClick(this._callback.deleteClick);
    this.onSetCancelClick(this._callback.cancelClick);
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();
    this._destroyDatepickers();
  }

  onSetSubmitClick(callback) {
    this._callback.submitClick = callback;
    this.getElement().addEventListener(`submit`, this._onFormSubmitClick);
  }

  onSetDeleteClick(callback) {
    this._callback.deleteClick = callback;
    this.getElement().addEventListener(`reset`, this._onFormDeleteClick);
  }

  onSetCancelClick(callback) {
    this._callback.cancelClick = callback;
    if (this._isEditViewMode) {
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._onFormCancelClick);
    } else {
      this.getElement().addEventListener(`reset`, this._onFormDeleteClick);
    }
  }

  onSetKeyDown(callback) {
    this.callback.keyDown = callback;
    document.addEventListener(`keydown`, this._onFormKeyDown);
  }

  reset(point) {
    this.updateData(point);
  }

  _onDateFromChange([userDate]) {
    this.updateData({
      dateFrom: new Date(Date.parse(userDate)).toISOString()
    });
  }

  _onDateToChange([userDate]) {
    this.updateData({
      dateTo: new Date(Date.parse(userDate)).toISOString()
    });
  }

  _destroyDatepickers() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }
  }

  _setDatepicker() {
    this._destroyDatepickers();

    this._datepickerFrom = flatpickr(
        this.getElement().querySelector(`input[name="event-start-time"]`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          [`time_24hr`]: true,
          maxDate: this._data.dateTo,
          defaultDate: this._data.dateFrom,
          onChange: this._onDateFromChange
        }
    );
    this._datepickerTo = flatpickr(
        this.getElement().querySelector(`input[name="event-end-time"]`),
        {
          enableTime: true,
          [`time_24hr`]: true,
          dateFormat: `d/m/y H:i`,
          minDate: this._data.dateFrom,
          defaultDate: this._data.dateTo,
          onChange: this._onDateToChange
        }
    );
  }

  _onOfferClick() {
    const checkedOffers = this.getElement().querySelectorAll(`.event__available-offers .event__offer-checkbox:checked`);
    const checkedOffersIds = Array.from(checkedOffers).map(({id}) => id);
    const offersByType = this.getOffersByType();

    const options = offersByType.filter(({title}) => {
      return checkedOffersIds.some((checkedOffersId) => checkedOffersId === getOfferId(title, this._data.id));
    });

    this.updateData({
      options
    });
  }

  _setInnerHandlers() {
    const element = this.getElement();

    element.querySelectorAll(`.event__type-input`).forEach((typePoint) => typePoint.addEventListener(`change`, this._onTypeChange));
    element.querySelector(`.event__input--destination`).addEventListener(`input`, this._onDestinationInput);
    element.querySelector(`.event__input--destination`).addEventListener(`change`, this._onDestinationChange);
    element.querySelectorAll(`.event__offer-checkbox`).forEach((item) => item.addEventListener(`change`, this._onOfferClick));
    element.querySelector(`.event__input--price`).addEventListener(`input`, this._onPriceChange);
  }

  _onTypeChange(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value
    });
    this._onOfferClick();
  }

  _onDestinationInput(evt) {
    evt.preventDefault();
    this._destinationsModel.getDestinations().forEach((element) => {
      if (element.name.includes(evt.target.value)) {
        this.updateData({
          destination: this.getDistinationByType(true, evt.target.value)
        }, true);
      }
    });
  }

  _onDestinationChange(evt) {
    evt.preventDefault();
    this.updateData({
      destination: this.getDistinationByType(true, evt.target.value)
    });
  }

  _onPriceChange(evt) {
    evt.preventDefault();
    this.updateData({
      price: Number(evt.target.value)
    }, true);
  }

  _onFormSubmitClick(evt) {
    evt.preventDefault();
    this._callback.submitClick(EditingPoint.parseDataToPoint(this._data));
  }

  _onFormDeleteClick(evt) {
    evt.preventDefault();
    if (this._isEditViewMode) {
      this._callback.deleteClick(EditingPoint.parseDataToPoint(this._data));
    } else {
      this._callback.cancelClick();
    }
  }

  _onFormCancelClick(evt) {
    evt.preventDefault();
    this._callback.cancelClick();
  }

  _onFormKeyDown(evt) {
    evt.preventDefault();
    this._callback.keyDown();
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
}
