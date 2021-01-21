import {generatePoint, getOffers, destinations} from "./mock/task.js";
import RoutePresenter from "./presenter/route.js";
import {render, RenderPosition} from "./utils/render.js";
import TripInfoView from "./view/trip-info.js";
import SiteMenuView from "./view/menu.js";
import HeaderMenuView from "./view/create-header-for-menu.js";
import TripEventListView from "./view/trip-event-list.js";
// import TripInformationView from "./view/trip-information.js";
import CreaturePointPresenter from "./presenter/creaturePoint.js";

const POINT_COUNT = 3;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const allOffers = getOffers();
const allDestinations = destinations;

const mainElement = document.querySelector(`.trip-main`);
const tripControlsElement = mainElement.querySelector(`.trip-main__trip-controls`);
const siteMainElement = document.querySelector(`.page-body__page-main`);
const tripEvents = siteMainElement.querySelector(`.trip-events`);
const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

const tripEventList = new TripEventListView();
render(tripEvents, tripEventList);
const siteListElement = tripEventList.getElement();
const routePresenter = new RoutePresenter(siteListElement);
routePresenter.init(points, allOffers, allDestinations);
render(mainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new SiteMenuView(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new HeaderMenuView(), RenderPosition.AFTERBEGIN);

newEventButton.addEventListener(`click`, () => {
  const creaturePointPresenter = new CreaturePointPresenter(siteListElement);
  creaturePointPresenter.init(points, allOffers, allDestinations);
});

// render(tripEvents, new TripInformationView(), RenderPosition.AFTERBEGIN);
// render(document.querySelector(`.trip-events`), new TripInformationView(), RenderPosition.AFTERBEGIN);
