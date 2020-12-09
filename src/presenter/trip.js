import {render, RenderPosition} from "../utils/render.js";
import TripInfoView from "../view/trip-info.js";

export default class Trip {
  constructor(tripContainer) {
    this._container = tripContainer;
  }

  init(points) {
    this._points = points.slice();
    render(this._container, new TripInfoView(this._points), RenderPosition.AFTERBEGIN);
  }
}
