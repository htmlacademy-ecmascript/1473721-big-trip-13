import {render, remove, replace, RenderPosition} from "../utils/render.js";
// import {render, remove} from "../utils/render.js";
import EditPointView from "../view/edit-point-new.js";
// import PointView from "../view/point.js";
import {UserAction, UpdateType} from "../mock/task.js";

const KEY_VALUE = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

// const Mode = {
//   DEFAULT: `DEFAULT`,
//   EDITING: `EDITING`
// };

export default class PointNewPresenter {
  constructor(pointsContainer, changeData, offersModel, destinationsModel) {
    this._pointsContainer = pointsContainer;
    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._pointEditComponent = null;
    this._destroyCallback = null;

    // this._onEditClick = this._onEditClick.bind(this);
    this._onCancelClick = this._onCancelClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleSaveClick = this._handleSaveClick.bind(this);
  }
  // init(points, allOffers, allDestinations) {
  //   this._points = points;
  //   this._point = this._points[0];
  //   this._pointComponent = new PointView(this._point);
  //   this._createComponent = new CreatePointView(this._point, allOffers, allDestinations);

  //   this._replacePointToForm();

  //   this._pointComponent.setEditClickHandler(this._onEditClick);
  //   this._createComponent.setCancelClickHandler(this._onCancelClick);
  //   this._createComponent.setSubmitClickHandler(this._handleSaveClick);
  // }
  init(callback) {
    this._destroyCallback = callback;

    if (this._pointEditComponent !== null) {
      return;
    }

    this._pointEditComponentNew = new EditPointView(this._offersModel, this._destinationsModel);
    this._pointEditComponentNew.setSubmitClickHandler(this._handleSaveClick);
    this._pointEditComponentNew.setCancelClickHandler(this._onCancelClick);

    render(this._pointsContainer, this._pointEditComponentNew, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  destroy() {
    if (this._pointEditComponentNew === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._pointEditComponentNew);
    this._pointEditComponentNew = null;

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _handleSaveClick(point) {
    // сделать нормальным
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point);
    this.destroy();
    // this._replaceFormToPoint();
  }

  _onCancelClick() {
    this.destroy();
    // this._createComponent.reset(this._point);
    // this._replaceFormToPoint();
  }

  _onEscKeyDown(evt) {
    if (evt.key === KEY_VALUE.ESCAPE || evt.key === KEY_VALUE.ESC) {
      evt.preventDefault();
      this.destroy();
      // this._createComponent.reset(this._point);
      // this._replaceFormToPoint();
    }
  }

  // Дальше мое старое

  // resetView() {
  //   if (this._mode !== Mode.DEFAULT) {
  //     this._replaceFormToPoint();
  //   }
  // }


  // _onEditClick() {
  //   this._replacePointToForm();
  // }

  // _handleCloseClick() {
  //   this._replaceFormToPoint();
  // }

  // _replacePointToForm() {
  //   render(this._pointsContainer, this._createComponent, RenderPosition.AFTERBEGIN);
  //   // replace(this._createComponent.getElement(), this._pointComponent.getElement());
  //   document.addEventListener(`keydown`, this._onEscKeyDown);
  //   // this._changeMode();
  //   // this._mode = Mode.EDITING;
  // }

  // _replaceFormToPoint() {
  //   replace(this._pointComponent.getElement(), this._createComponent.getElement());
  //   document.removeEventListener(`keydown`, this._onEscKeyDown);
  //   // this._mode = Mode.DEFAULT;
  // }


  // getId() {
  //   return this._point.id;
  // }

  // destroy() {
  //   remove(this._pointComponent);
  //   remove(this._createComponent);
  // }
}

