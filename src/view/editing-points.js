// import {getOffers, getRandomInteger, ValueForRandom} from "../utils/task.js";
import {PointType, pointTypeResource, PointField} from "../mock/task.js";
// import AbstractView from "./abstract.js";
import Smart from "./smart.js";
// import {getOptions} from "../mock/task.js";

// import flatpickr from "flatpickr";
// import dayjs from "dayjs";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createOffersList = (selectedOffers, offers) => {
  return offers.reduce((acc, offer) => {

    const checked = selectedOffers.some((selectedOffer) => selectedOffer.title.toLowerCase() === offer.title.toLowerCase());
    const checkedValue = checked ? `checked` : ``;

    acc += `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}" ${checkedValue}>
      <label class="event__offer-label" for="event-offer-${offer.title}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
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
  dateIn = `18/03/2020 14:22`,
  dateOut = `19/03/2020 11:05`,
  price = `0`,
  options: selectedOffers}, offers, destination) => {

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
          ${createEventsTypeList(Object.values(PointType), type, id)}
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
        ${createDestinitionList(PointField.CITY_POINT)}
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
      <p class="event__destination-description">${destination.description}</p>
    </section>
  </section>
</form>
</li>`;
};

class EditPointView extends Smart {
  constructor(point, allOffers, allDestinations) {
    super();
    this._point = point;
    this._element = null;
    this._datepicker = null;

    this._allOffers = allOffers;
    this._allDestinations = allDestinations;

    this._formSubmitClickHandler = this._formSubmitClickHandler.bind(this);
    this._formCancelClickHandler = this._formCancelClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._offerClickHandler = this._offerClickHandler.bind(this);

    this._availableOffers = this.getElement().querySelectorAll(`.event__offer-checkbox`);

    this._toggleCheckOffers = this._toggleCheckOffers.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditingPointElement(this._point, this.getOffersByType(), this.getDistinationByType(this._point.city));
  }

  getOffersByType() {
    const offerByType = this._allOffers.find((offer) => offer.type === this._point.type);

    if (offerByType) {
      return offerByType.offers;
    }

    return [];
  }

  getDistinationByType(city) {
    const destinitionByType = this._allDestinations.find((destination) => destination.name === city);

    if (destinitionByType) {
      return destinitionByType;
    }

    return [];
  }

  // _setDatepicker() {
  //   if (this._datepicker) {
  //     this._datepicker.destroy();
  //     this._datepicker = null;
  //   }

  //   if (this._data.isDueDate) {
  //     this._datepicker = flatpickr(
  //         this.getElement().querySelector(`.event__input--time`),
  //         {
  //           // dateFormat: `j F`,
  //           // defaultDate: this._data.dueDate,
  //           onChange: this._dueDateChangeHandler
  //         }
  //     );
  //   }
  // }

  _toggleCheckOffers() {
    // this._availableOffers.forEach(offer =>)
  }

  // setCheckHandler(callback) {
  //   this._callback.checkChange = callback;
  //   this.getElement().querySelectorAll(`.event__offer-label`).forEach((element) => element.addEventListener(`click`, this._offerClickHandler));
  // }

  _offerClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    const title = evt.target.querySelector(`.event__offer-title`).innerHTML;
    const offers = this._allOffers.find((element) => element.type === this._point.type);
    const offer = offers.offers.find((element) => element.title === title);
    const index = this._point.options.indexOf(offer);
    if (index === -1) {
      this._point.options.push(offer);
    } else {
      this._point.options.splice(index, 1);
    }
    this.getElement().querySelectorAll(`.event__offer-label`).forEach((element) => element.removeEventListener(`click`, this._offerClickHandler));
  }

  // _dueDateChangeHandler([userDate]) {

  //   this.updateData({
  //     dueDate: dayjs(userDate).hour(23).minute(59).second(59).toDate()
  //   });
  // }

  reset(point) {
    this.updateData(point);
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll(`.event__type-input`).forEach((typePoint) => typePoint.addEventListener(`change`, this._typeChangeHandler));
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChangeHandler);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      city: evt.target.value
    });
  }

  addOffersInPoint() {
    // console.log(this._point.options);
    // console.log(this.getElement().querySelectorAll(`.event__offer-checkbox`).filter((offer) => offer.hasAttribute(`checked`) === `checked`));
    // const pr = this.getElement().querySelectorAll(`.event__offer-checkbox`);
    // let help = [];
    // pr.forEach((p) => {
    // if (p.hasAttribute(`checked`)) {
    // help.push(p);
    // }
    // });
    // console.log(help);
    // debugger;
    // pr.filter((p) => console.log(p.hasAttribute(`checked`) === `true`));
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitClickHandler(this._callback.submitClick);
    this.setCancelClickHandler(this._callback.cancelClick);
  }

  static parse(data) {
    data = Object.assign({}, data);
    return data;
  }

  _formSubmitClickHandler(evt) {
    evt.preventDefault();
    // console.log(this);
    // console.log(this._point);
    this._callback.submitClick(EditPointView.parse(this._point));
    // console.log(this._point);
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

  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
    this.getElement().querySelector(`form`).addEventListener(`reset`, this._formCancelClickHandler);
  }

  setKeyDownHandler(callback) {
    this.callback.keyDown = callback;
    document.addEventListener(`keydown`, this._formKeyDownHandler);
  }
}

export default EditPointView;
