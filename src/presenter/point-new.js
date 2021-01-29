import {remove, render, RenderPosition} from "../utils/render.js";
import EditPointView from "../view/editing-point.js";
import {KEY_VALUE} from "./point.js";
import {UserAction, UpdateType} from "../const.js";

export default class PointNew {
  constructor(pointsContainer, changeData, offersModel, destinations) {
    this._pointsContainer = pointsContainer;
    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinations = destinations;

    this._editComponent = null;
    this._point = null;
    this._destroyCallback = null;

    this._onCancelClick = this._onCancelClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onSaveClick = this._onSaveClick.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._editComponent !== null) {
      return;
    }

    this._isEditViewMode = false;
    this._editComponent = new EditPointView(this._offersModel, this._destinations, this._isEditViewMode);
    this._editComponent.setSubmitClickHandler(this._onSaveClick);
    this._editComponent.setCancelClickHandler(this._onCancelClick);
    this._editComponent.setDeleteClickHandler(this._onDeleteClick);

    const element = this._pointsContainer.getElement().querySelector(`.trip-events__item`);
    render(this._pointsContainer, this._editComponent, RenderPosition.INSERT_BEFORE, element);

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onSaveClick(point) {
    this._point = point;
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        // Object.assign({id: new Date().valueOf()}, point)
        point
    );
  }

  _onCancelClick() {
    remove(this._editComponent);
    this.destroy();
  }

  _onEscKeyDown(evt) {
    if (evt.key === KEY_VALUE.ESCAPE || evt.key === KEY_VALUE.ESC) {
      evt.preventDefault();
      remove(this._editComponent);
      this._editComponent.reset(this._point);
      this.destroy();
    }
  }

  setSaving() {
    this._editComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._editComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._eitComponent.shake(resetFormState);
  }

  destroy() {
    if (this._editComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._editComponent);
    this._editComponent = null;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
