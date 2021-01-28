import {SortType, UpdateType, UserAction} from "../mock/task.js";
import {sortByDay, sortByPrice, sortByTime} from "../utils/task.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import TripSortView from "../view/trip-sort.js";
import NoPointView from "../view/no-point.js";
import PointPresenter from "./point.js";
import {filter} from "../utils/filter.js";
import PointNewPresenter from "./point-new.js";
import LoadingView from "../view/loading.js";

export default class Route {
  constructor(container, pointsModel, offersModel, destinationsModel, filtersModel, api) {
    this._siteListElement = container;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._filtersModel = filtersModel;
    this._destinationsModel = destinationsModel;
    this._currentSortType = SortType.DAY;
    this._pointsPresenter = [];

    this._isLoading = true;
    this._api = api;

    // this._sortComponent = new TripSortView();
    this._loadingComponent = new LoadingView();

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._noPointView = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._siteListElement, this._handleViewAction, this._offersModel, this._destinationsModel);
  }

  init() {
    this._sortComponent = new TripSortView();
    // this._renderPointsList();
    // this._renderSort();
    this._renderRoute();

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearPointsList();
    remove(this._sortComponent);
    this._pointNewPresenter.destroy();
  }

  createPoint(callback) {
    this._pointNewPresenter.init(callback);
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
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPointsList() {
    const points = this._getPoints();
    debugger;

    if (points.length === 0) {
      debugger;
      this._noPointView = new NoPointView();
      render(this._siteListElement, this._noPointView);
      return;
    }
    this._renderPoints(points);
  }

  _renderRoute() {
    debugger;
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    // const points = this._getPoints();

    // if (points.length === 0) {
    //   this._noPointView = new NoPointView();
    //   render(this._siteListElement, this._noPointView);
    //   return;
    // }
    // this._renderPoints(points);

    this._renderPointsList();
    this._renderSort();
  }

  _renderPoints(points) {
    debugger;
    if (this._pointsPresenter.length === 0) {
      points.forEach((point) => {
        debugger;
        const pointPresenter = new PointPresenter(this._siteListElement, this._handleModeChange, this._handleViewAction, this._offersModel, this._destinationsModel);
        debugger;
        pointPresenter.init(point);
        debugger;
        this._pointsPresenter.push(pointPresenter);
      });
    }
  }

  _renderLoading() {
    render(this._siteListElement, this._loadingComponent);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPointsList();
    this._renderPointsList();
  }

  _handleModeChange() {
    Object.values(this._pointsPresenter).forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(point) {
    this._pointsPresenter.find((element) => element.getId() === point.id).init(point);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, point) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._handlePointChange(point);
        this._pointsPresenter.find((element) => element.getId() === point.id).init(point);
        break;
      case UpdateType.MINOR:
        this._handlePointChange(point);
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
        debugger;
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
  }
}
