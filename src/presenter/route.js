import {SortType, UpdateType, UserAction} from "../const.js";
import {sortByDay, sortByPrice, sortByTime} from "../utils/task.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import TripEventListView from "../view/trip-event-list.js";
import TripEventListViewItem from "../view/trip-event-list-item.js";
import TripSortView from "../view/trip-sort.js";
import NoPointView from "../view/no-points.js";
import PointPresenter, {State as PointPresenterViewState} from "./point.js";
import {filter} from "../utils/filter.js";
import PointNewPresenter from "./point-new.js";
import LoadingView from "../view/loading.js";

export default class Route {
  constructor(tripEvents, pointsModel, offersModel, destinationsModel, filtersModel, api) {
    this._tripEvents = tripEvents;
    this._siteListElement = null;
    this._tripEventListElement = null;

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

    this._pointNewPresenter = new PointNewPresenter(this._onViewAction, this._offersModel, this._destinationsModel);
  }

  init() {
    this._renderRoute();

    this._pointsModel.addObserver(this._onModelEvent);
    this._filtersModel.addObserver(this._onModelEvent);
  }

  destroy() {
    this._clearPointsList();

    this._pointNewPresenter.destroy();
  }

  createPoint(callback) {
    if (this._siteListElement) {
      this._pointNewPresenter.init(callback, this._siteListElement, RenderPosition.INSERT_BEFORE);
    } else {
      this._pointNewPresenter.init(callback, this._tripEvents, RenderPosition.BEFOREEND);
    }
  }

  renderNoPoints() {
    const points = this._getPoints();

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
    this._sortComponent = new TripSortView();
    render(this._tripEvents, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.onSetSortTypeChange(this._onSortTypeChange);
  }

  _renderPointsList() {
    const points = this._getPoints();

    if (points.length === 0) {
      this._noPointView = new NoPointView();
      render(this._tripEvents, this._noPointView);
      return;
    }

    this._renderSort();

    this._siteListElement = new TripEventListView();
    render(this._tripEvents, this._siteListElement);

    this._renderPoints(this._siteListElement, this._getPoints());
  }


  _renderRoute() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderPointsList();
  }

  _renderPoints(container, points) {
    if (this._pointsPresenter.length === 0) {
      points.forEach((point) => {
        const itemContainer = new TripEventListViewItem(container);
        render(container, itemContainer);

        const pointPresenter = new PointPresenter(itemContainer, this._onModeChange, this._onViewAction, this._offersModel, this._destinationsModel);
        pointPresenter.init(point);
        this._pointsPresenter.push(pointPresenter);
      });
    }
  }

  _renderLoading() {
    render(this._tripEvents, this._loadingComponent);
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
    this._destroyPointNewPresenter();
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
        this._clearPointsList();
        this._renderRoute();
        break;
    }
  }

  _destroyPointNewPresenter() {
    if (this._pointNewPresenter) {
      this._pointNewPresenter.destroy();
    }
  }

  _clearPointsList() {
    this._destroyPointNewPresenter();

    Object.values(this._pointsPresenter).forEach((presenter) => presenter.destroy());
    this._pointsPresenter = [];

    if (this._siteListElement) {
      remove(this._siteListElement);
      this._siteListElement = null;
    }

    if (this._noPointView) {
      remove(this._noPointView);
      this._noPointView = null;
    }

    if (this._sortComponent) {
      remove(this._sortComponent);
      this._sortComponent = null;
    }

    if (this._loadingComponent) {
      remove(this._loadingComponent);
      this._loadingComponent = null;

      this._isLoading = false;
    }
  }
}
