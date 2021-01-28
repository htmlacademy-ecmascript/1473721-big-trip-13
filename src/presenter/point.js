import {render, remove, replace} from "../utils/render.js";
import EditPointView from "../view/editing-point.js";
import PointView from "../view/point.js";
import {UserAction, UpdateType} from "../mock/task.js";

export const KEY_VALUE = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(pointsContainer, changeMode, changeData, offersModel, destinations) {
    this._pointsContainer = pointsContainer;
    this._offersModel = offersModel;
    this._destinations = destinations;
    this._changeMode = changeMode;
    this._changeData = changeData;

    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._editComponent = null;
    this._isEditViewMode = true;

    this._onEditClick = this._onEditClick.bind(this);
    this._onCancelClick = this._onCancelClick.bind(this);
    this._onDeleteClick = this._onDeleteClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onSaveClick = this._onSaveClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
  }

  // init(point, offersModel, allDestinations) {
  init(point) {

    debugger;
    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._editComponent;

    this._point = point;
    this._pointComponent = new PointView(point);
    this._editComponent = new EditPointView(this._offersModel, this._destinations, this._isEditViewMode, point);

    this._pointComponent.setEditClickHandler(this._onEditClick);
    this._pointComponent.setFavoritesClickHandler(this._onFavoriteClick);
    this._editComponent.setDeleteClickHandler(this._onDeleteClick);
    this._editComponent.setSubmitClickHandler(this._onSaveClick);
    this._editComponent.setCancelClickHandler(this._onCancelClick);

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

  _onDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MAJOR,
        point
    );
    this._replaceFormToPoint();
  }

  _onSaveClick(point) {
    const isMinorUpdate = this._point.dateFrom !== point.dateFrom || this._point.dateTo !== point.dateTo || this._point.price !== point.price;
    this._changeData(
        UserAction.UPDATE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        point
    );
    this._replaceFormToPoint();
  }

  _onEditClick() {
    this._replacePointToForm();
  }

  _onCloseClick() {
    this._replaceFormToPoint();
  }

  _onFavoriteClick(point) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        point
    );
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
