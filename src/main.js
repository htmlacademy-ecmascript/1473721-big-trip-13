import {generatePoint, getOffers, destinations, UpdateType} from "./mock/task.js";
import RoutePresenter from "./presenter/route.js";
import FilterPresenter from "./presenter/filter.js";
// import {remove, render, RenderPosition} from "./utils/render.js";
import {remove, render, RenderPosition} from "./utils/render.js";
import TripInfoView from "./view/trip-info.js";
import SiteMenuView from "./view/menu.js";
import HeaderMenuView from "./view/create-header-for-menu.js";
import TripEventListView from "./view/trip-event-list.js";
import TripInformationView from "./view/trip-information.js";
// import CreaturePointPresenter from "./presenter/creaturePoint.js";
import PointsModel from "./model/points.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import FilterModel from "./model/filter.js";
import {MenuItem} from "./const.js";
import {FilterType} from "./utils/task.js";

const POINT_COUNT = 3;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const allOffers = getOffers();
const allDestinations = destinations;

const pointsModel = new PointsModel();
pointsModel.setPoints(points);
const offersModel = new OffersModel();
offersModel.setOffers(allOffers);
const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(allDestinations);
const filtersModel = new FilterModel();

const mainElement = document.querySelector(`.trip-main`);
const tripControlsElement = mainElement.querySelector(`.trip-main__trip-controls`);
const siteMainElement = document.querySelector(`.page-body__page-main`);
const tripEvents = siteMainElement.querySelector(`.trip-events`);
// const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

const tripEventList = new TripEventListView();
tripEventList.init();
const siteMenu = new SiteMenuView();
// const TripInformation = new TripInformationView();

render(tripEvents, tripEventList);
// const siteListElement = tripEventList.getElement();
const siteListElement = tripEventList;
const routePresenter = new RoutePresenter(siteListElement, pointsModel, offersModel, destinationsModel, filtersModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filtersModel, pointsModel);
// routePresenter.init();
render(mainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
render(tripControlsElement, siteMenu, RenderPosition.AFTERBEGIN);
render(tripControlsElement, new HeaderMenuView(), RenderPosition.AFTERBEGIN);

// render(tripEvents, TripInformation);
// TripInformation.hide();

const handlePointNewFormClose = () => {
  siteMenu.getElement().querySelector(`[type=${MenuItem.ADD_NEW_POINT}]`).classList.remove(`trip-tabs__btn--active`);
  // siteMenu.setMenuItem(MenuItem.TABLE);
};

// let statisticsComponent = new TripInformationView(pointsModel.getPoints());
let statisticsComponent = null;
// statisticsComponent.init();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      remove(statisticsComponent);
      routePresenter.destroy();
      // filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      routePresenter.init();
      routePresenter.createPoint(handlePointNewFormClose);
      // filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      // statisticsComponent.hide();
      // routePresenter.show();
      // routePresenter.createPoint(handlePointNewFormClose);
      break;
    case MenuItem.TABLE:
      // filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      routePresenter.init();
      remove(statisticsComponent);
      // statisticsComponent.hide();
      // routePresenter.show();
      break;
    case MenuItem.STATISTICS:
      routePresenter.destroy();
      statisticsComponent = new TripInformationView(pointsModel.getPoints());
      statisticsComponent.init();
      // routePresenter.hide();
      // statisticsComponent.show();
      render(tripEvents, statisticsComponent);
      break;
    default:
      statisticsComponent.hide();
      routePresenter.show();
      break;
  }
};

siteMenu.setMenuClickHandler(handleSiteMenuClick);
filterPresenter.init();
routePresenter.init();

// newEventButton.addEventListener(`click`, (evt) => {
//   evt.preventDefault();
//   routePresenter.createPoint();
// });

// siteMenu.getElement().querySelector(`a[type="stats"]`).addEventListener(`click`, showStats);

// function showStats() {
//   routePresenter.hide();
//   TripInformation.show();
// }
// render(document.querySelector(`.trip-events`), new TripInformationView(), RenderPosition.AFTERBEGIN);
