import {render, RenderPosition} from "../utils/render.js";
import TripInformationView from "../view/trip-information.js";

export default class Menu {
  init(element) {
    render(element, new TripInformationView(), RenderPosition.AFTERBEGIN);
  }
}
