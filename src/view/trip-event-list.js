import {createElement} from "../util.js";

const createTripEventListElement = () =>
  `<ul class="trip-events__list"></ul>`;

class TripEventListView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripEventListElement();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default TripEventListView;
