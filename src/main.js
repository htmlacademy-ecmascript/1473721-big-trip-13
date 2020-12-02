import HeaderMenuView from "./view/create-header-for-menu.js";
import SiteMenuView from "./view/menu.js";
import TripInfoView from "./view/trip-info.js";
import TripInformationView from "./view/trip-information.js";
import TripFilterView from "./view/trip-filter.js";
import TripSortView from "./view/trip-sort.js";
// import CreatePointView from "./view/creature-point.js";
import TripEventListView from "./view/trip-event-list.js";
import EditPointView from "./view/editing-points.js";
import PointView from "./view/point.js";
import {generatePoint} from "./mock/task.js";
import {render, RenderPosition} from "./util.js";
import NoPointView from "./view/no-point.js";

const KEY_VALUE = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

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
// render(siteListElement, new CreatePointView(points[0]).getElement());

const renderPoint = (pointList, point) => {
  const pointComponent = new PointView(point);
  const editComponent = new EditPointView(point);

  const editComponentElement = editComponent.getElement();
  const pointComponentElement = pointComponent.getElement();

  const replacePointToForm = () => {
    pointList.replaceChild(editComponentElement, pointComponentElement);
  };

  const replaceFormToPoint = () => {
    pointList.replaceChild(pointComponentElement, editComponentElement);
  };

  const formComponent = editComponentElement.querySelector(`form`);
  const formButtonCancel = formComponent.querySelector(`.event__reset-btn`);

  const onEscKeyDown = (evt) => {
    if (evt.key === KEY_VALUE.ESCAPE || evt.key === KEY_VALUE.ESC) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
      formButtonCancel.removeEventListener(`click`, onCancelClick);
    }
  };

  const onCancelClick = (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
    formButtonCancel.removeEventListener(`click`, onCancelClick);
  };

  pointComponentElement.querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
    formButtonCancel.addEventListener(`click`, onCancelClick);
  });

  formComponent.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
    formButtonCancel.removeEventListener(`click`, onCancelClick);
  });

  formButtonCancel.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
    formButtonCancel.removeEventListener(`click`, onCancelClick);
  });

  render(pointList, pointComponentElement);

};

const renderPoints = () => {
  if (points.length === 0) {
    render(siteListElement, new NoPointView().getElement());
  }
  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoint(siteListElement, points[i]);
  }
};

renderPoints();

render(siteContentElement, new TripInformationView().getElement(), RenderPosition.AFTERBEGIN);
