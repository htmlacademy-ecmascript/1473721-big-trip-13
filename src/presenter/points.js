import {render} from "../utils/render.js";
import NoPointView from "../view/no-point.js";
import PointPresenter from "./point.js";

const POINT_COUNT = 20;

export default class Points {
  constructor(pointsContainer) {
    this._pointsContainer = pointsContainer;
    this._pointPresenter = [];
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    if (this._points.length === 0) {
      render(this._pointsContainer, new NoPointView());
    }
    this._renderPoints(this._points);
  }

  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _renderPoints(points) {
    for (let i = 0; i < POINT_COUNT; i++) {
      const pointPresenter = new PointPresenter(this._pointsContainer, this._handleModeChange);
      pointPresenter.init(points[i]);
      this._pointPresenter.push(pointPresenter);
    }
  }
}

