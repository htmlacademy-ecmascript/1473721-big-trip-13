import {remove, render} from "../utils/render.js";
import EditingPoint from "../view/editing-point.js";
import {KEY_VALUE} from "./point.js";
import {UserAction, UpdateType} from "../const.js";

export default class PointNew {
  constructor(changeData, offersModel, destinations) {
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

  init(callback, container, position) {
    this._destroyCallback = callback;
    this._container = container;

    if (this._editComponent !== null) {
      return;
    }

    this._isEditViewMode = false;
    this._editComponent = new EditingPoint(this._offersModel, this._destinations, this._isEditViewMode);
    this._editComponent.onSetSubmitClick(this._onSaveClick);
    this._editComponent.onSetCancelClick(this._onCancelClick);

    render(this._container, this._editComponent, position);
    document.addEventListener(`keydown`, this._onEscKeyDown);
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

  _onSaveClick(point) {
    this._point = point;
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
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
}
