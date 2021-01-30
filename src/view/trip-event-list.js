import AbstractView from "./abstract.js";

const createTripEventListElement = () =>
  `<ul class="trip-events__list"></ul>`;

export default class TripEventList extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createTripEventListElement();
  }
}
