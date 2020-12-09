import HeaderMenuView from "./view/create-header-for-menu.js";
import SiteMenuView from "./view/menu.js";
import TripInformationView from "./view/trip-information.js";
import TripFilterView from "./view/trip-filter.js";
import TripSortView from "./view/trip-sort.js";
// import CreatePointView from "./view/creature-point.js";
import TripEventListView from "./view/trip-event-list.js";
import {generatePoint} from "./mock/task.js";
import {render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import RoutePresenter from "./presenter/route.js";

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector(`.trip-main`);
const tripControlsElement = mainElement.querySelector(`.trip-main__trip-controls`);

const siteMainElement = document.querySelector(`.page-body__page-main`);
const siteContentElement = siteMainElement.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(mainElement);
tripPresenter.init(points);

render(tripControlsElement, new SiteMenuView(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new HeaderMenuView(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new TripFilterView());

render(siteContentElement, new TripSortView());

render(siteContentElement, new TripEventListView());
const siteListElement = siteMainElement.querySelector(`.trip-events__list`);
// render(siteListElement, new CreatePointView(points[0]);
const routePresenter = new RoutePresenter(siteListElement);
routePresenter.init(points);

render(siteContentElement, new TripInformationView(), RenderPosition.AFTERBEGIN);
