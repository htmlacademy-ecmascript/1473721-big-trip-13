import {render} from "../utils/render.js";
import TripSortView from "../view/trip-sort.js";

export default class Menu {
  init(element) {
    render(element, new TripSortView());
  }
}
