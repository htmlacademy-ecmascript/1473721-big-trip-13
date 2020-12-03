import AbstractView from "./abstract.js";

const createHeaderMenu = () => `<h2 class="visually-hidden">Switch trip view</h2>`;

class HeaderMenuView extends AbstractView {
  getTemplate() {
    return createHeaderMenu();
  }
}

export default HeaderMenuView;
