import { HeaderMenuView } from "./view/create-header-for-menu.js";
import { SiteMenuView } from "./view/menu.js";
import { TripInfoView } from "./view/trip-info.js";
import { TripInformationView } from "./view/trip-information.js";
import { TripFilterView } from "./view/trip-filter.js";
import { TripSortView } from "./view/trip-sort.js";
import { CreatePointView } from "./view/creature-point.js";
import { TripEventListView } from "./view/trip-event-list.js";
import { EditPointView } from "./view/editing-points.js";
import { PointView } from "./view/point.js";
import { generatePoint } from "./mock/task.js";
import { render, RenderPosition} from "./util.js";

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector(`.trip-main`);
const tripControlsElement = mainElement.querySelector(`.trip-main__trip-controls`);

const siteMainElement = document.querySelector(`.page-body__page-main`);
const siteContentElement = siteMainElement.querySelector(`.trip-events`);

render(mainElement, new TripInfoView(points).getElement(), RenderPosition.AFTERBEGIN);

render(tripControlsElement, new SiteMenuView().getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new HeaderMenuView().getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new TripFilterView().getElement());

render(siteContentElement, new TripSortView().getElement());

render(siteContentElement, new TripEventListView().getElement());
const siteListElement = siteMainElement.querySelector(`.trip-events__list`);
render(siteListElement, new CreatePointView(points[0]).getElement());

const renderPoint = (pointList, point) => {
  const pointComponent = new PointView(point);
  const editComponent = new EditPointView(point)

  const replacePointToForm = () => {
    pointList.replaceChild(editComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    pointList.replaceChild(pointComponent.getElement(), editComponent.getElement());
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToForm();
  });

  editComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
  });

  render(pointList, pointComponent.getElement());

};



for (let i = 0; i < POINT_COUNT; i++) {
  renderPoint(siteListElement, points[i]);
}

render(siteContentElement, new TripInformationView().getElement(), RenderPosition.AFTERBEGIN);
