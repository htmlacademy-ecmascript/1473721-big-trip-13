import {generatePoint, SortType} from "../mock/task.js";
import {sortByDay, sortByPrice, sortByTime} from "../utils/task.js";
import PointsPresenter from "./points.js";
import CreaturePointPresenter from "./creaturePoint.js";
import {render, RenderPosition} from "../utils/render.js";
import TripInfoView from "../view/trip-info.js";
import SiteMenuView from "../view/menu.js";
import HeaderMenuView from "../view/create-header-for-menu.js";
import TripFilterView from "../view/trip-filter.js";
import TripSortView from "../view/trip-sort.js";
import TripEventListView from "../view/trip-event-list.js";
import TripInformationView from "../view/trip-information.js";

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

export default class Route {
  constructor() {
    this._mainElement = document.querySelector(`.trip-main`);
    this._tripControlsElement = this._mainElement.querySelector(`.trip-main__trip-controls`);
    this._siteMainElement = document.querySelector(`.page-body__page-main`);
    this._siteContentElement = this._siteMainElement.querySelector(`.trip-events`);
    this._points = points.slice();
    this._defaultPoint = points.slice();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._currentSortType = SortType.DAY;

    this._sortComponent = new TripSortView();
    this._siteMenu = new SiteMenuView();
    this._headerMenu = new HeaderMenuView();
    this._filter = new TripFilterView();
    this._tripEventList = new TripEventListView();
    this._tripStat = new TripInformationView();
  }

  init() {
    this._renderTrip();
    this._renderMenu();
    this._renderHeaderMenu();
    this._renderFilter();
    this._renderSort();
    this._renderEventList();
    // this._renderCreaturePoint();
    this._renderPoints();
    this._renderStat();
  }

  _renderTrip() {
    render(this._mainElement, new TripInfoView(this._points), RenderPosition.AFTERBEGIN);
  }

  _renderMenu() {
    render(this._tripControlsElement, this._siteMenu, RenderPosition.AFTERBEGIN);
  }

  _renderHeaderMenu() {
    render(this._tripControlsElement, this._headerMenu, RenderPosition.AFTERBEGIN);
  }

  _renderFilter() {
    render(this._tripControlsElement, this._filter);
  }

  _sortPoint(sortType) {
    switch (sortType) {
      case SortType.DAY:

        // this._points.day.sort(sortByDay);
        break;
      case SortType.PRICE:
        // console.log(this._points);
        // console.log(this._points);
        // this._points.sort(sortByPrice);
        this._points.sort(sortByDay);
        // console.log(this._points);
        break;
      case SortType.TIME:
        // console.log(this._points);
        this._points.sort(sortByTime);
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoint(sortType);
    this._clearPoints();
    // this._renderPoints();
  }

  _renderSort() {
    render(this._siteContentElement, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEventList() {
    render(this._siteContentElement, this._tripEventList);
  }

  _renderCreaturePoint() {
    this._siteListElement = this._siteMainElement.querySelector(`.trip-events__list`);
    this._creaturePointPresenter = new CreaturePointPresenter(points[0]);
    this._creaturePointPresenter.init(this._siteListElement);
  }

  _renderPoints() {
    this._siteListElement = this._siteMainElement.querySelector(`.trip-events__list`);
    this._pointsPresenter = new PointsPresenter(this._siteListElement);
    this._pointsPresenter.init(points);
  }

  _renderStat() {
    render(this._siteContentElement, this._tripStat, RenderPosition.AFTERBEGIN);
  }

  _clearPoints() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }
}
