import AbstractView from "./abstract.js";

const createTripEventListElement = () =>
  `<ul class="trip-events__list"></ul>`;

export default class TripEventListView extends AbstractView {
  getTemplate() {
    return createTripEventListElement();
  }
}
