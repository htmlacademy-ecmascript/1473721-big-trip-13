import {render, RenderPosition} from "../utils/render.js";
import HeaderMenuView from "../view/create-header-for-menu.js";

export default class Menu {
  init(element) {
    render(element, new HeaderMenuView(), RenderPosition.AFTERBEGIN);
  }
}
