import {UpdateType, MenuItem} from "./const.js";
import RoutePresenter from "./presenter/route.js";
import FilterPresenter from "./presenter/filter.js";
import {remove, render, RenderPosition} from "./utils/render.js";
import TripInfoView from "./view/trip-information.js";
import SiteMenuView from "./view/menu.js";
import HeaderMenuView from "./view/header-menu.js";
import TripEventListView from "./view/trip-event-list.js";
import TripStatistics from "./view/trip-statistics.js";
import PointsModel from "./model/points.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import FilterModel from "./model/filter.js";
import {FilterType} from "./utils/task.js";
import Api from "./api/api.js";
import {isOnline} from "./utils/common.js";
import {toast} from "./utils/toast/toast.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic VGgJGhwdgjwgd34gr`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `bigTrip-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const pointsModel = new PointsModel();


const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filtersModel = new FilterModel();

const mainElement = document.querySelector(`.trip-main`);
const tripControlsElement = mainElement.querySelector(`.trip-main__trip-controls`);
const siteMainElement = document.querySelector(`.page-body__page-main`);
const tripEvents = siteMainElement.querySelector(`.trip-events`);
let statisticsComponent = null;

const tripEventList = new TripEventListView();
const siteMenu = new SiteMenuView();
const tripInfoView = new TripInfoView(pointsModel);
tripInfoView.init();

render(tripEvents, tripEventList);

const siteListElement = tripEventList;

const routePresenter = new RoutePresenter(tripEvents, siteListElement, pointsModel, offersModel, destinationsModel, filtersModel, apiWithProvider);
const filterPresenter = new FilterPresenter(tripControlsElement, filtersModel, pointsModel);

render(tripControlsElement, new HeaderMenuView(), RenderPosition.AFTERBEGIN);

const onPointNewFormClose = () => {
  siteMenu.setAddNewButtonState(false);
  siteMenu.setActiveMenu(MenuItem.TABLE);
  // routePresenter.renderNoPoints(false);
  // routePresenter.renderNoPoints();

};

const onSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      remove(statisticsComponent);
      routePresenter.destroy();
      filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      routePresenter.init();
      if (!isOnline()) {
        toast(`You can't create new point offline`);
        siteMenu.setActiveMenu(MenuItem.TASKS);
        break;
      }
      routePresenter.createPoint(onPointNewFormClose);
      siteMenu.setAddNewButtonState(true);
      break;
    case MenuItem.TABLE:
      routePresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      routePresenter.destroy();
      statisticsComponent = new TripStatistics(pointsModel.getPoints());
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

Promise.all([apiWithProvider.getOffers(), apiWithProvider.getDestinations(), apiWithProvider.getPoints()]).then(([offers = [], destinations = [], points = []]) => {
  offersModel.setOffers(offers);
  destinationsModel.setDestinations(destinations);
  pointsModel.setPoints(UpdateType.INIT, points);
  render(mainElement, tripInfoView, RenderPosition.AFTERBEGIN);
  render(tripControlsElement, siteMenu, RenderPosition.AFTERBEGIN);
  siteMenu.setActiveMenu(MenuItem.TABLE);
  siteMenu.onSetMenuClick(onSiteMenuClick);
})
.catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);
  render(mainElement, tripInfoView, RenderPosition.AFTERBEGIN);
  render(tripControlsElement, siteMenu, RenderPosition.AFTERBEGIN);
  siteMenu.setActiveMenu(MenuItem.TABLE);
  siteMenu.onSetMenuClick(onSiteMenuClick);
});

// window.addEventListener(`load`, () => {
//   navigator.serviceWorker.register(`/sw.js`);
// });

// window.addEventListener(`online`, () => {
//   document.title = document.title.replace(` [offline]`, ``);
//   apiWithProvider.sync();
// });

// window.addEventListener(`offline`, () => {
//   document.title += ` [offline]`;
// });
