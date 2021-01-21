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
  constructor(pointsContainer, changeMode, changeData) {
    this._pointsContainer = pointsContainer;
    this._changeMode = changeMode;
    this._changeData = changeData;

    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._editComponent = null;

    this._onEditClick = this._onEditClick.bind(this);
    this._onCancelClick = this._onCancelClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleSaveClick = this._handleSaveClick.bind(this);
  }

  init(point, allOffers, allDestinations) {

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._editComponent;

    this._point = point;
    this._pointComponent = new PointView(point);
    this._editComponent = new EditPointView(point, allOffers, allDestinations);

    this._pointComponent.setEditClickHandler(this._onEditClick);
    this._editComponent.setCancelClickHandler(this._onCancelClick);
    this._editComponent.setSubmitClickHandler(this._handleSaveClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointsContainer, this._pointComponent);
      return;
    }
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }
    if (this._mode === Mode.EDITING) {
      replace(this._editComponent, prevPointEditComponent);
    }
    remove(prevPointComponent);
    remove(prevPointEditComponent);

    // this._allOffers = allOffers;

    // render(this._pointsContainer, this._pointComponent);
  }

  _onEscKeyDown(evt) {
    if (evt.key === KEY_VALUE.ESCAPE || evt.key === KEY_VALUE.ESC) {
      evt.preventDefault();
      this._editComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  _onCancelClick() {
    this._editComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _handleSaveClick(point) {
    this._changeData(point);
    this._replaceFormToPoint();
  }

  _onEditClick() {
    this._replacePointToForm();
  }

  _handleCloseClick() {
    this._replaceFormToPoint();
  }

  _replacePointToForm() {
    replace(this._editComponent.getElement(), this._pointComponent.getElement());
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent.getElement(), this._editComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  getId() {
    return this._point.id;
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editComponent);
  }
}
