// import TaskEditView from "../view/task-edit.js";
// import {generateId} from "../mock/task.js";
import {remove, render, RenderPosition} from "../utils/render.js";
// import {UserAction, UpdateType} from "../const.js";
import CreatePointView from "../view/creature-point.js";
import {KEY_VALUE} from "./point.js";
import {UserAction, UpdateType} from "../mock/task.js";

export default class PointNew {
  constructor(pointsContainer, changeData, offersModel, destinations) {
    this._pointsContainer = pointsContainer;
    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinations = destinations;

    this._editComponent = null;

    this._onCancelClick = this._onCancelClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onSaveClick = this._onSaveClick.bind(this);
  }

  init() {
    // console.log(pointsModel.get);
    if (this._editComponent !== null) {
      return;
    }

    // this._editComponent = new CreatePointView(pointsModel, this._offersModel, this._destinations);
    this._editComponent = new CreatePointView(this._offersModel, this._destinations);
    this._editComponent.setSubmitClickHandler(this._handleFormSubmit);

    render(this._pointsContainer, this._editComponent);

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  destroy() {
    if (this._editComponent === null) {
      return;
    }

    remove(this._editComponent);
    this._editComponent = null;

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onSaveClick(point) {
    this._changeData(
        UserAction.ADD_TASK,
        UpdateType.MINOR,
        Object.assign({id: new Date().valueOf()}, point)
    );
    this.destroy();
  }

  _onCancelClick() {
    this.destroy();
  }

  _onEscKeyDown(evt) {
    if (evt.key === KEY_VALUE.ESCAPE || evt.key === KEY_VALUE.ESC) {
      evt.preventDefault();
      this._editComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }
}
