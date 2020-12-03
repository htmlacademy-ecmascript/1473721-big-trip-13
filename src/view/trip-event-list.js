import AbstractView from "./abstract.js";

const createTripEventListElement = () =>
  `<ul class="trip-events__list"></ul>`;

class TripEventListView extends AbstractView {
  getTemplate() {
    return createTripEventListElement();
  }
}

export default TripEventListView;
