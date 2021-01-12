import {render, RenderPosition} from "../utils/render.js";
import CreatePointView from "../view/creature-point.js";

export default class Menu {
  constructor(point) {
    this._point = point;
  }
  init(element) {
    render(element, new CreatePointView(this._point), RenderPosition.AFTERBEGIN);
  }
}
