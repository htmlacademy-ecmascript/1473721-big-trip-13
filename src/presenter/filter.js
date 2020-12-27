import {render} from "../utils/render.js";
import TripFilterView from "../view/trip-filter.js";

export default class Menu {
  init(element) {
    render(element, new TripFilterView());
  }
}
