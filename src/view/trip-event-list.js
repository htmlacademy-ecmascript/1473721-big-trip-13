import AbstractView from "./abstract.js";

const createTripEventListElement = () =>
  `<ul class="trip-events__list"></ul>`;

export default class TripEventListView extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createTripEventListElement();
  }
}
