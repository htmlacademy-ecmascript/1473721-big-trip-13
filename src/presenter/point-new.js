// import TaskEditView from "../view/task-edit.js";
// import {generateId} from "../mock/task.js";
import {remove, render, RenderPosition} from "../utils/render.js";
// import {UserAction, UpdateType} from "../const.js";
// import CreatePointView from "../view/edit-point-new.js";
import EditPointView from "../view/editing-point.js";
import {KEY_VALUE} from "./point.js";
import {UserAction, UpdateType} from "../mock/task.js";

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
    debugger;
    this._destroyCallback = callback;
    // console.log(pointsModel.get);
    if (this._editComponent !== null) {
      return;
    }

    this._isEditViewMode = false;
    // this._editComponent = new CreatePointView(pointsModel, this._offersModel, this._destinations);
    // this._editComponent = new CreatePointView(this._offersModel, this._destinations);
    this._editComponent = new EditPointView(this._offersModel, this._destinations, this._isEditViewMode);
    this._editComponent.setSubmitClickHandler(this._onSaveClick);
    this._editComponent.setCancelClickHandler(this._onCancelClick);
    this._editComponent.setDeleteClickHandler(this._onDeleteClick);

    render(this._pointsContainer, this._editComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  // понять что надо этот или в самом низу

  // destroy() {
  //   if (this._editComponent === null) {
  //     return;
  //   }

  //   remove(this._editComponent);
  //   this._editComponent = null;

  //   document.removeEventListener(`keydown`, this._onEscKeyDown);
  // }

  _onSaveClick(point) {
    debugger;
    this._point = point;
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        Object.assign({id: new Date().valueOf()}, point)
    );
    debugger;
    this.destroy();
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
      // this._replaceFormToPoint();
    }
  }

  // начал добавлять

  getId() {
    return this._point.id;
  }

  destroy() {
    if (this._editComponent === null) {
      return;
    }

    // if (this._destroyCallback !== null) {
    //   debugger;
    //   // this._destroyCallback();
    // }
    // remove(this._pointComponent);
    remove(this._editComponent);
  }
}
