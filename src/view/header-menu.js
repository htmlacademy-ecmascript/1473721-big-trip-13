import AbstractView from "./abstract.js";

const createHeaderMenu = () => `<h2 class="visually-hidden">Switch trip view</h2>`;

export default class HeaderMenu extends AbstractView {
  getTemplate() {
    return createHeaderMenu();
  }
}
