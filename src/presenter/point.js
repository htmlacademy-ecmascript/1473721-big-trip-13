import {render, remove, replace} from "../utils/render.js";
import EditPointView from "../view/editing-points.js";
import PointView from "../view/point.js";

const KEY_VALUE = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(pointsContainer, changeMode) {
    this._pointsContainer = pointsContainer;
    this._changeMode = changeMode;
    // this._allOffers = [];

    this._mode = Mode.DEFAULT;

    this._onEditClick = this._onEditClick.bind(this);
    this._onCancelClick = this._onCancelClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleSaveClick = this._handleSaveClick.bind(this);
    // this._replaceFormToPoint = this._replaceFormToPoint.bind(this);
    // this._replacePointToForm = this._replacePointToForm.bind(this);
  }

  init(point, allOffers, allDestinations) {
    this._point = point;
    this._pointComponent = new PointView(point);
    this._editComponent = new EditPointView(point, allOffers, allDestinations);

    // this._allOffers = allOffers;

    this._pointComponent.setEditClickHandler(this._onEditClick);
    // this._pointComponent.setFavoritesClickHandler(this._pointComponent.toggleFavorite);
    // this._editComponent.setFormSubmitHandler(this._replaceFormToPoint);
    this._editComponent.setCancelClickHandler(this._onCancelClick);
    this._editComponent.setSubmitClickHandler(this._handleSaveClick);

    render(this._pointsContainer, this._pointComponent);
  }

  // _removeEventListener() {
  // this._form = this._editComponent.getElement().querySelector(`form`);
  // document.removeEventListener(`keydown`, this._onEscKeyDown);
  // this._form.removeEventListener(`reset`, this._onCancelClick);
  // this._form.removeEventListener(`submit`, this._onSaveClick);
  // }

  _onEscKeyDown(evt) {
    if (evt.key === KEY_VALUE.ESCAPE || evt.key === KEY_VALUE.ESC) {
      evt.preventDefault();
      // this._removeEventListener();
      // this._editComponent.addOffersInPoint();
      this._editComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  _onCancelClick() {
    // this._removeEventListener();
    this._editComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _handleSaveClick() {
    // console.log(this);
    // this._removeEventListener();
    // console.log(this._pointComponent);
    this._point = Object.assign({}, this._point, this._editComponent._point);
    console.log(this);
    console.log(this._point);
    // console.log(this._point);
    // console.log(this._pointComponent);

    // this._editComponent.addOffersInPoint();
    // this._replaceFormToPoint();
  }

  _onEditClick() {
    this._replacePointToForm();
  }

  _handleCloseClick() {
    this._replaceFormToPoint();
  }

  _replacePointToForm() {
    replace(this._editComponent.getElement(), this._pointComponent.getElement());
    // this._editComponent.setCheckHandler();
    // this._form = this._editComponent.getElement().querySelector(`form`);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    // this._form.addEventListener(`reset`, this._onCancelClick);
    // this._form.addEventListener(`submit`, this._onSaveClick);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  // _help() {
  //   console.log(`я тут`);
  // }

  _replaceFormToPoint() {
    replace(this._pointComponent.getElement(), this._editComponent.getElement());
    // this._removeEventListener();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editComponent);
  }
}
