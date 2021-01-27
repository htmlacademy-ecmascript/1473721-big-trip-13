import {createElement} from "../utils/render.js";

export default class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }
    this._element = null;
    this._callback = {};

    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  show() {
    if (this._element.classList.contains(`visually-hidden`)) {
      this._element.classList.remove(`visually-hidden`);
    }

  }

  hide() {
    if (!this._element.classList.contains(`visually-hidden`)) {
      this._element.classList.add(`visually-hidden`);
    }
  }

  removeElement() {
    this._element = null;
  }
}
