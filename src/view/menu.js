import AbstractView from "./abstract.js";

const createMenuTemplate = () =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`;

class SiteMenuView extends AbstractView {
  getTemplate() {
    return createMenuTemplate();
  }
}

export default SiteMenuView;
