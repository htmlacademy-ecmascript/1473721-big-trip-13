import AbstractView from "./abstract.js";

const createMenuTemplate = () =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" type="table" href="#">Table</a>
      <a class="trip-tabs__btn" href="#" type="stats">Stats</a>
    </nav>`;

export default class SiteMenuView extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    console.log(menuItem);
    const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    items.forEach((item) => {
      if (item.classList.contains(`trip-tabs__btn--active`)) {
        console.log(`ghbdtn`);
      }
    });

    // if (item.classList.contains(`trip-tabs__btn--active`)) {
    //   item.checked = true;
    // }
  }
}
