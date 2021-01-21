import {SortType} from "../mock/task.js";
import {sortByDay, sortByPrice, sortByTime} from "../utils/task.js";
import {updateItem} from "../utils/common.js";
import {render} from "../utils/render.js";
import TripFilterView from "../view/trip-filter.js";
import TripSortView from "../view/trip-sort.js";
import NoPointView from "../view/no-point.js";
import PointPresenter from "./point.js";

export default class Route {
  constructor(container) {
    this._siteListElement = container;
    this._currentSortType = SortType.DAY;
    this._pointsPresenter = [];

    this._sortComponent = new TripSortView();
    this._filter = new TripFilterView();

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
  }

  init(points, allOffers, allDestinations) {
    this._points = points.slice();
    this._allOffers = allOffers;
    this._allDestinations = allDestinations;
    this._sortPoint(SortType.DAY);
    this._renderFilter();
    this._renderSort();
    this._renderPointsList(this._points);
  }

  _renderFilter() {
    this._tripControlsElement = document.querySelector(`.trip-main__trip-controls`);
    render(this._tripControlsElement, this._filter);
  }

  _renderSort() {
    render(this._siteListElement, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPointsList(points) {
    if (points.length === 0) {
      render(this._siteListElement, new NoPointView());
    }
    this._renderPoints(points);
  }

  _renderPoints(points) {
    points.forEach((point) => {
      const pointPresenter = new PointPresenter(this._siteListElement, this._handleModeChange, this._handlePointChange);
      pointPresenter.init(point, this._allOffers, this._allDestinations);
      this._pointsPresenter.push(pointPresenter);
    });
  }

  _sortPoint(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._points.sort(sortByDay);
        break;
      case SortType.TIME:
        this._points.sort(sortByTime);
        break;
      case SortType.PRICE:
        this._points.sort(sortByPrice);
        break;
      default:
        this._points.sort(sortByDay);
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._sortPoint(sortType);
    this._clearPointsList();
    this._renderPointsList(this._points);
  }

  _handleModeChange() {
    Object.values(this._pointsPresenter).forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatePoint) {
    this._points = updateItem(this._points, updatePoint);
    this._pointsPresenter.find((element) => element.getId() === updatePoint.id).init(updatePoint, this._allOffers, this._allDestinations);
  }

  _clearPointsList() {
    Object.values(this._pointsPresenter).forEach((presenter) => presenter.destroy());
    this._pointsPresenter = [];
  }
}
