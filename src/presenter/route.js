import {render} from "../utils/render.js";
import NoPointView from "../view/no-point.js";
import PointPresenter from "./point.js";

const POINT_COUNT = 20;

export default class Route {
  constructor(pointsContainer) {
    this._pointsContainer = pointsContainer;
  }

  init(points) {
    this._points = points.slice();
    if (this._points.length === 0) {
      render(this._pointsContainer, new NoPointView());
    }
    for (let i = 0; i < POINT_COUNT; i++) {
      new PointPresenter(this._pointsContainer).init(this._points[i]);
    }
  }
}

