import {getOffers, getRandomInteger, ValueForRandom} from "../utils/task.js";
import {getDescription, PointType, pointTypeResource} from "../mock/task.js";
// import AbstractView from "./abstract.js";
import Smart from "./smart.js";
import {ucFirst} from "../utils/common.js";
import {getOptions} from "../mock/task.js";

import flatpickr from "flatpickr";
import dayjs from "dayjs";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createEditingPointElement = ({type = PointType.TAXI,
  city = ` `,
  id = `1`,
  dateIn = `18/03/2020 14:22`,
  dateOut = `19/03/2020 11:05`,
  price = `0`,
  options: selectedOffers,
  description = ``}, offers) => {

  const createOffersList = (selectedOffersArray, offersArray) => {
    return offersArray.reduce((acc, offer) => {

      const checked = selectedOffersArray.some((selectedOffer) => selectedOffer.title.toLowerCase() === offer.title.toLowerCase());
      const checkedValue = checked ? checked : ``;

      acc += `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}" ${checkedValue}>
        <label class="event__offer-label" for="event-offer-${offer.title}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
    }, ``);
  };

  const createEventsTypeList = (events) => {
    const reducer = (element, event) => element + `<div class="event__type-item">
        <input id="event-type-${event.toLowerCase()}-${id}" class="event__type-input  visually-hidden" type="radio"
          name="event-type" value="${event.toLowerCase()}">
        <label class="event__type-label  event__type-label--${event.toLowerCase()}" for="event-type-${event.toLowerCase()}-${id}">${event}</label>
      </div>`;

    let eventsElement = ``;
    return events.reduce(reducer, eventsElement);
  };

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png"
          alt="Event type icon">
      </label>
      <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${createEventsTypeList(Object.values(pointTypeResource))}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
       ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text"
        name="event-destination" value="${city}" list="destination-list-1">
      <datalist id="destination-list-1">
        <option value="Amsterdam"></option>
        <option value="Geneva"></option>
        <option value="Chamonix"></option>
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text"
        name="event-start-time" value="${dateIn}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text"
        name="event-end-time" value="${dateOut}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price"
        value="${price}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${createOffersList(selectedOffers, offers)}
      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
    </section>
  </section>
</form>
</li>`;
};

class EditPointView extends Smart {
  constructor(point, allOffers) {
    super();
    this._point = point;
    this._element = null;
    this._datepicker = null;

    this._allOffers = allOffers;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCancelClickHandler = this._formCancelClickHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._endRoutToggleHandler = this._endRoutToggleHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditingPointElement(this._point, this.getOffersByType());
  }

  getOffersByType() {
    const offerByType = this._allOffers.find((offer) => offer.type === this._point.type.toLowerCase());

    if (offerByType) {
      return offerByType.offers;
    }

    return [];
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    if (this._data.isDueDate) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`.event__input--time`),
          {
            // dateFormat: `j F`,
            // defaultDate: this._data.dueDate,
            onChange: this._dueDateChangeHandler
          }
      );
    }
  }

  // _dueDateChangeHandler([userDate]) {

  //   this.updateData({
  //     dueDate: dayjs(userDate).hour(23).minute(59).second(59).toDate()
  //   });
  // }

  reset(point) {
    this.updateData({point});
  }

  _setInnerHandlers() {
    this._typePoints = this.getElement().querySelectorAll(`.event__type-input`);
    this._typePoints.forEach((typePoint) => typePoint.addEventListener(`change`, this._typeToggleHandler));
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._endRoutToggleHandler);
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: ucFirst(evt.target.value),
      options: getOptions(evt.target.value.toUpperCase())
    });
  }

  _endRoutToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      city: evt.target.value,
      description: getDescription()
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCancelClickEdit(this._callback.cancelClick);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  _formCancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.cancelClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setCancelClickEdit(callback) {
    this._callback.cancelClick = callback;
    this.getElement().querySelector(`form`).querySelector(`.event__reset-btn`).addEventListener(`click`, this._formCancelClickHandler);
  }
}

export default EditPointView;
