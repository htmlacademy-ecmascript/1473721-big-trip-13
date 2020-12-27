import {render} from "../utils/render.js";
import TripEventListView from "../view/trip-event-list.js";

export default class Menu {
  init(element) {
    render(element, new TripEventListView());
  }
}
