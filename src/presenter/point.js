import {render, remove, replace} from "../utils/render.js";
import EditingPoint from "../view/editing-point.js";
import PointView from "../view/point.js";
import {UserAction, UpdateType} from "../const.js";
import {isOnline} from "../utils/common.js";
import {toast} from "../utils/toast/toast.js";

export const KEY_VALUE = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class Point {
  constructor(pointsContainer, changeMode, changeData, offersModel, destinationsModel) {
    this._pointsContainer = pointsContainer;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
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

  init(point) {
    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._editComponent;

    this._point = point;
    this._pointComponent = new PointView(point);
    this._editComponent = new EditingPoint(this._offersModel, this._destinationsModel, this._isEditViewMode, point);

    this._pointComponent.onSetEditClick(this._onEditClick);
    this._pointComponent.onSetFavoritesClick(this._onFavoriteClick);
    this._editComponent.onSetDeleteClick(this._onDeleteClick);
    this._editComponent.onSetSubmitClick(this._onSaveClick);
    this._editComponent.onSetCancelClick(this._onCancelClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointsContainer, this._pointComponent);
      return;
    }
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }
    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevPointEditComponent);
      this._mode = Mode.DEFAULT;
    }
    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._editComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };
    switch (state) {
      case State.SAVING:
        this._editComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._editComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._editComponent.shake(resetFormState);
        break;
    }
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
    if (!isOnline()) {
      toast(`You can't delete point offline`);
      return;
    }

    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  _onSaveClick(point) {
    if (!isOnline()) {
      toast(`You can't save point offline`);
      return;
    }

    const isMinorUpdate = this._point.dateFrom !== point.dateFrom || this._point.dateTo !== point.dateTo || this._point.price !== point.price;
    this._changeData(
        UserAction.UPDATE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        point
    );
  }

  _onEditClick() {
    if (!isOnline()) {
      toast(`You can't edit point offline`);
      return;
    }
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
}
