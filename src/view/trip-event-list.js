import AbstractView from "./abstract.js";

const createTripEventListElement = () =>
  `<ul class="trip-events__list"></ul>`;

export default class TripEventListView extends AbstractView {
  constructor() {
    super();
    this._element = null;
  }

  init() {
    this._element = this.getElement();
  }

  getTemplate() {
    return createTripEventListElement();
  }
}
