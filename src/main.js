import {generatePoint, getOffers, destinations, UpdateType} from "./mock/task.js";
import RoutePresenter from "./presenter/route.js";
import FilterPresenter from "./presenter/filter.js";
import {remove, render, RenderPosition} from "./utils/render.js";
import TripInfoView from "./view/trip-info.js";
import SiteMenuView from "./view/menu.js";
import HeaderMenuView from "./view/create-header-for-menu.js";
import TripEventListView from "./view/trip-event-list.js";
import TripInformationView from "./view/trip-information.js";
import PointsModel from "./model/points.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import FilterModel from "./model/filter.js";
import {MenuItem} from "./const.js";
import {FilterType} from "./utils/task.js";
import Api from "./api.js";

// const POINT_COUNT = 3;
const AUTHORIZATION = `Basic VGVJGhwdgjwgd3647`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

// const points = new Array(POINT_COUNT).fill().map(generatePoint);

const allOffers = getOffers();
const allDestinations = destinations;

const pointsModel = new PointsModel();
// pointsModel.setPoints(points);


const offersModel = new OffersModel();
offersModel.setOffers(allOffers);
const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(allDestinations);
const filtersModel = new FilterModel();

const mainElement = document.querySelector(`.trip-main`);
const tripControlsElement = mainElement.querySelector(`.trip-main__trip-controls`);
const siteMainElement = document.querySelector(`.page-body__page-main`);
const tripEvents = siteMainElement.querySelector(`.trip-events`);
let statisticsComponent = null;

const tripEventList = new TripEventListView();
tripEventList.init();
const siteMenu = new SiteMenuView();

render(tripEvents, tripEventList);

const siteListElement = tripEventList;
// const routePresenter = new RoutePresenter(siteListElement, pointsModel, offersModel, destinationsModel, filtersModel);
const routePresenter = new RoutePresenter(siteListElement, pointsModel, offersModel, destinationsModel, filtersModel, api);
const filterPresenter = new FilterPresenter(tripControlsElement, filtersModel, pointsModel);

// render(mainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
// render(mainElement, new TripInfoView(pointsModel.getPoints()), RenderPosition.AFTERBEGIN);
// render(tripControlsElement, siteMenu, RenderPosition.AFTERBEGIN);
render(tripControlsElement, new HeaderMenuView(), RenderPosition.AFTERBEGIN);

const handlePointNewFormClose = () => {
  siteMenu.setAddNewButtonState(false);
  siteMenu.setActiveMenu(MenuItem.TABLE);
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      remove(statisticsComponent);
      routePresenter.destroy();
      filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      routePresenter.init();
      routePresenter.createPoint(handlePointNewFormClose);
      siteMenu.setAddNewButtonState(true);
      break;
    case MenuItem.TABLE:
      routePresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      routePresenter.destroy();
      statisticsComponent = new TripInformationView(pointsModel.getPoints());
      statisticsComponent.init();
      render(tripEvents, statisticsComponent);
      break;
    default:
      routePresenter.init();
      remove(statisticsComponent);
      break;
  }
};

filterPresenter.init();
routePresenter.init();

api.getPoints()
.then((points) => {
  debugger;
  pointsModel.setPoints(UpdateType.INIT, points);
  // render(mainElement, new TripInfoView(pointsModel.getPoints()), RenderPosition.AFTERBEGIN);
  render(mainElement, new TripInfoView(pointsModel), RenderPosition.AFTERBEGIN);
  render(tripControlsElement, siteMenu, RenderPosition.AFTERBEGIN);
  siteMenu.setActiveMenu(MenuItem.TABLE);
  siteMenu.setMenuClickHandler(handleSiteMenuClick);
})
.catch(() => {
  debugger;
  pointsModel.setPoints(UpdateType.INIT, []);
  render(mainElement, new TripInfoView(pointsModel.getPoints()), RenderPosition.AFTERBEGIN);
  render(tripControlsElement, siteMenu, RenderPosition.AFTERBEGIN);
  siteMenu.setActiveMenu(MenuItem.TABLE);
  siteMenu.setMenuClickHandler(handleSiteMenuClick);
});
