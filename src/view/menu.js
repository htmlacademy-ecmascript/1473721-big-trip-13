// import AbstractView from "./abstract.js";
import Abstract from "./abstract.js";

const createMenuTemplate = () =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" data-type="TABLE" href="#">Table</a>
      <a class="trip-tabs__btn" href="#" data-type="STATISTICS">Stats</a>
    </nav>`;

export default class SiteMenuView extends Abstract {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
    this._menuLinks = this.getElement().querySelectorAll(`.trip-tabs__btn`);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._menuLinks.forEach((element) => element.classList.remove(`trip-tabs__btn--active`));
    evt.target.classList.add(`trip-tabs__btn--active`);
    this._callback.menuClick(evt.target.dataset.type);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this._menuLinks.forEach((element) => {
      // if (!element.classList.contains(`trip-tabs__btn--active`)) {
      element.addEventListener(`click`, this._menuClickHandler);
      // }
    });
    document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    this._p = menuItem;
    // console.log(menuItem);
    // const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    // items.forEach((item) => {
    //   if (item.classList.contains(`trip-tabs__btn--active`)) {
    //     console.log(`ghbdtn`);
    //   }
    // });

    // if (item.classList.contains(`trip-tabs__btn--active`)) {
    //   item.checked = true;
    // }
  }
}
