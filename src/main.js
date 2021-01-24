import {generatePoint, getOffers, destinations} from "./mock/task.js";
import RoutePresenter from "./presenter/route.js";
import FilterPresenter from "./presenter/filter.js";
import {render, RenderPosition} from "./utils/render.js";
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
const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

const tripEventList = new TripEventListView();
const siteMenu = new SiteMenuView();
const TripInformation = new TripInformationView();

render(tripEvents, tripEventList);
const siteListElement = tripEventList.getElement();
const routePresenter = new RoutePresenter(siteListElement, pointsModel, offersModel, destinationsModel, filtersModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filtersModel, pointsModel);
filterPresenter.init();
routePresenter.init();
render(mainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
render(tripControlsElement, siteMenu, RenderPosition.AFTERBEGIN);
render(tripControlsElement, new HeaderMenuView(), RenderPosition.AFTERBEGIN);

render(tripEvents, TripInformation);
TripInformation.hide();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      // Скрыть статистику
      // Показать доску
      // Показать форму добавления новой задачи
      // Убрать выделение с ADD NEW TASK после сохранения
      break;
    case MenuItem.TABLE:
      // Показать доску
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      // Скрыть доску
      // Показать статистику
      break;
  }
};

siteMenu.setMenuClickHandler(handleSiteMenuClick);

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
