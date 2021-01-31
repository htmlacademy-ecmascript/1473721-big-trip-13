import AbstractView from "./abstract.js";

const createTripEventListItemElement = () =>
  `<li class="trip-events__item"></li>`;

export default class TripEventListItem extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createTripEventListItemElement();
  }
}
