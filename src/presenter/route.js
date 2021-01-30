import {SortType, UpdateType, UserAction} from "../const.js";
import {sortByDay, sortByPrice, sortByTime} from "../utils/task.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import TripSortView from "../view/trip-sort.js";
import NoPointView from "../view/no-points.js";
import PointPresenter, {State as PointPresenterViewState} from "./point.js";
import {filter} from "../utils/filter.js";
import PointNewPresenter from "./point-new.js";
import LoadingView from "../view/loading.js";

export default class Route {
  constructor(tripEvents, container, pointsModel, offersModel, destinationsModel, filtersModel, api) {
    this._tripEvents = tripEvents;
    this._siteListElement = container;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._filtersModel = filtersModel;
    this._destinationsModel = destinationsModel;
    this._currentSortType = SortType.DAY;
    this._pointsPresenter = [];

    this._isLoading = true;
    this._api = api;

    this._loadingComponent = new LoadingView();

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._noPointView = null;

    this._onViewAction = this._onViewAction.bind(this);
    this._onModelEvent = this._onModelEvent.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onModeChange = this._onModeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._siteListElement, this._onViewAction, this._offersModel, this._destinationsModel);
  }

  init() {
    this._sortComponent = new TripSortView();
    this.renderNoPoints();
    this._renderRoute();


    this._pointsModel.addObserver(this._onModelEvent);
    this._filtersModel.addObserver(this._onModelEvent);
  }

  destroy() {
    this._clearPointsList();
    remove(this._sortComponent);
    this._pointNewPresenter.destroy();
  }

  createPoint(callback) {
    this._pointNewPresenter.init(callback);
  }

  // renderNoPoints(state) {
    renderNoPoints() {
    const points = this._getPoints();
    // const condition = state ? points.length === 0 && !this._noPointView : points.length === 0;
    // if (condition) {
      debugger;
    if (points.length === 0) {
      this._noPointView = new NoPointView();
      render(this._tripEvents, this._noPointView);
      return;
    }
  }

  _getPoints() {
    const filterType = this._filtersModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filtredPoints.sort(sortByDay);
      case SortType.TIME:
        return filtredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filtredPoints.sort(sortByPrice);
      default:
        return filtredPoints.sort(sortByDay);
    }
  }

  _renderSort() {
    render(this._siteListElement, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.onSetSortTypeChange(this._onSortTypeChange);
  }

  _renderPointsList() {
    // this.renderNoPoints(true);
    // this.renderNoPoints();
    this._renderPoints(this._getPoints());
  }


  _renderRoute() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderPointsList();
    this._renderSort();
  }

  _renderPoints(points) {
    if (this._pointsPresenter.length === 0) {
      points.forEach((point) => {
        const pointPresenter = new PointPresenter(this._siteListElement, this._onModeChange, this._onViewAction, this._offersModel, this._destinationsModel);
        pointPresenter.init(point);
        this._pointsPresenter.push(pointPresenter);
      });
    }
  }

  _renderLoading() {
    render(this._siteListElement, this._loadingComponent);
  }

  _onSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPointsList();
    this._renderPointsList();
  }

  _onModeChange() {
    Object.values(this._pointsPresenter).forEach((presenter) => presenter.resetView());
  }

  _onPointChange(point) {
    this._pointsPresenter.find((element) => element.getId() === point.id).init(point);
  }

  _onViewAction(actionType, updateType, update) {
    const pointPresenter = this._pointsPresenter.find((element) => element.getId() === update.id);
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        pointPresenter.setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
        .then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
        .catch(() => {
          pointPresenter.setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
        .then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
        .catch(() => {
          this._pointNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_POINT:
        pointPresenter.setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
        .then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
        .catch(() => {
          pointPresenter.setViewState(PointPresenterViewState.ABORTING);
        });
        break;
    }
  }

  _onModelEvent(updateType, point) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._onPointChange(point);
        this._pointsPresenter.find((element) => element.getId() === point.id).init(point);
        break;
      case UpdateType.MINOR:
        this._onPointChange(point);
        this._clearPointsList();
        this._renderPointsList();
        break;
      case UpdateType.MAJOR:
        this._clearPointsList();
        this._renderPointsList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderRoute();
        break;
    }
  }

  _clearPointsList() {
    if (this._noPointView) {
      remove(this._noPointView);
    }

    this._pointNewPresenter.destroy();
    Object.values(this._pointsPresenter).forEach((presenter) => presenter.destroy());
    this._pointsPresenter = [];

    remove(this._loadingComponent);
    remove(this._noPointView);
  }
}
