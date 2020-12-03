import AbstractView from "./abstract.js";

const createNoPointElement = () => `<p class="trip-events__msg">Click New Event to create your first point</p>`;


class NoPointView extends AbstractView {
  getTemplate() {
    return createNoPointElement();
  }
}

export default NoPointView;
