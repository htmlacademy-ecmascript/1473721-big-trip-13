// import AbstractView from "./abstract.js";
import Abstract from "./abstract.js";
import {MenuItem} from "../const.js";

const createMenuTemplate = () =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" data-type="${MenuItem.TABLE}" href="#">Table</a>
      <a class="trip-tabs__btn" href="#" data-type="${MenuItem.STATISTICS}">Stats</a>
    </nav>`;

export default class SiteMenuView extends Abstract {
  constructor() {
    super();
    this._menuLinks = null;
    this._addButton = null;
    this._menuClickHandler = this._menuClickHandler.bind(this);
    this._addButtinClickHAndler = this._addButtinClickHAndler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setActiveMenu(menuType) {
    if (this._menuLinks) {
      this._menuLinks.forEach((element) => {
        if (element.dataset.type === menuType) {
          element.classList.add(`trip-tabs__btn--active`);
        } else {
          element.classList.remove(`trip-tabs__btn--active`);
        }
      });
    }
  }

  setAddNewButtonState(isDisables) {
    this._addButton.disabled = isDisables;
  }

  _initMenu() {
    if (!this._menuLinks) {
      this._menuLinks = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    }

    if (!this._addButton) {
      this._addButton = document.querySelector(`.trip-main__event-add-btn`);
      this._addButton.dataset.type = MenuItem.ADD_NEW_POINT;
    }
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    const menuType = evt.target.dataset.type;
    this.setActiveMenu(menuType);
    this._callback.menuClick(menuType);
  }

  _addButtinClickHAndler(evt) {
    evt.preventDefault();
    const menuType = evt.target.dataset.type;
    this.setActiveMenu(MenuItem.TABLE);
    this._callback.menuClick(menuType);
  }

  setMenuClickHandler(callback) {
    this._initMenu();
    this._callback.menuClick = callback;
    this._menuLinks.forEach((element) => element.addEventListener(`click`, this._menuClickHandler));
    this._addButton.addEventListener(`click`, this._addButtinClickHAndler);
  }
}
