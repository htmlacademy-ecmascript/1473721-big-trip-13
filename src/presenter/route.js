import {generatePoint} from "../mock/task.js";
import TripPresenter from "./trip.js";
import PointsPresenter from "./points.js";
import MenuPresenter from "./menu.js";
import HeaderMenuPresenter from "./headerMenu.js";
import FilterPresenter from "./filter.js";
import SortPresenter from "./sort.js";
import EventListPresenter from "./eventList.js";
import CreaturePointPresenter from "./creaturePoint.js";
import StatPresenter from "./stat.js";

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

export default class Route {
  constructor() {
    this._mainElement = document.querySelector(`.trip-main`);
    this._tripControlsElement = this._mainElement.querySelector(`.trip-main__trip-controls`);
    this._siteMainElement = document.querySelector(`.page-body__page-main`);
    this._siteContentElement = this._siteMainElement.querySelector(`.trip-events`);
    // this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
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
    this._tripPresenter = new TripPresenter(this._mainElement);
    this._tripPresenter.init(points);
  }

  _renderMenu() {
    this._menuPresenter = new MenuPresenter();
    this._menuPresenter.init(this._tripControlsElement);
  }

  _renderHeaderMenu() {
    this._headerMenu = new HeaderMenuPresenter();
    this._headerMenu.init(this._tripControlsElement);
  }

  _renderFilter() {
    this._filterPresenter = new FilterPresenter();
    this._filterPresenter.init(this._tripControlsElement);
  }

  // _handleSortTypeChange(sortType) {
  // }

  _renderSort() {
    this._sortPresenter = new SortPresenter();
    this._sortPresenter.init(this._siteContentElement);
    // this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEventList() {
    this._eventListPresenter = new EventListPresenter();
    this._eventListPresenter.init(this._siteContentElement);
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
    this._statPresenter = new StatPresenter();
    this._statPresenter.init(this._siteContentElement);
  }
}
