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
import {render, RenderPosition} from "./utils/render.js";
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

render(mainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);

render(tripControlsElement, new SiteMenuView(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new HeaderMenuView(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new TripFilterView());

render(siteContentElement, new TripSortView());

render(siteContentElement, new TripEventListView());
const siteListElement = siteMainElement.querySelector(`.trip-events__list`);
// render(siteListElement, new CreatePointView(points[0]);

const renderPoint = (pointList, point) => {
  const pointComponent = new PointView(point);
  const editComponent = new EditPointView(point);

  const replacePointToForm = () => {
    pointList.replaceChild(editComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    pointList.replaceChild(pointComponent.getElement(), editComponent.getElement());
  };

  const formComponent = editComponent.getElement().querySelector(`form`);

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
    // formButtonCancel.removeEventListener(`click`, onCancelClick);
  };

  pointComponent.setEditClickHandler(() => {
    replacePointToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
    // formButtonCancel.addEventListener(`click`, onCancelClick);
  });

  editComponent.setFormSubmitHandler(() => {
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
    // formButtonCancel.removeEventListener(`click`, onCancelClick);
  });

  formButtonCancel.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
    // formButtonCancel.removeEventListener(`click`, onCancelClick);
  });

  render(pointList, pointComponent);

};

const renderPoints = () => {
  if (points.length === 0) {
    render(siteListElement, new NoPointView());
  }
  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoint(siteListElement, points[i]);
  }
};

renderPoints();

render(siteContentElement, new TripInformationView(), RenderPosition.AFTERBEGIN);
