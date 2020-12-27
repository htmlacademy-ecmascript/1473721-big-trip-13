import {render, RenderPosition} from "../utils/render.js";
import SiteMenuView from "../view/menu.js";

export default class Menu {
  init(element) {
    render(element, new SiteMenuView(), RenderPosition.AFTERBEGIN);
  }
}
