import { createMenuTemplate } from "./view/menu.js";
import { createTripInfoElement } from "./view/trip-info.js";
import { createTripInformationElement } from "./view/trip-information.js";
import { createTripFilterElement } from "./view/trip-filter.js";
import { createTripSortElement } from "./view/trip-sort.js";
import { createPointElement } from "./view/creature-point.js";
import { createTripEventListElement } from "./view/trip-event-list.js";
import { createEditingPointElement } from "./view/editing-points.js";
import { createPoint } from "./view/point.js";
import { generatePoint } from "./mock/task.js";

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const menuElement = document.querySelector(`.trip-main`);
const menuHeaderElement = menuElement.querySelector(`h2`);
const filterElement = menuElement.querySelector(`.trip-main__trip-controls`);

const siteMainElement = document.querySelector(`.page-body__page-main`);
const siteContentElement = siteMainElement.querySelector(`.trip-events`);


const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

render(menuElement, createTripInfoElement(points), `afterbegin`);
render(menuHeaderElement, createMenuTemplate(), `afterend`);
render(filterElement, createTripFilterElement());
render(siteContentElement, createTripSortElement());

render(siteContentElement, createTripEventListElement());
const siteListElement = siteMainElement.querySelector(`.trip-events__list`);
render(siteListElement, createPointElement(points[0]));
render(siteListElement, createEditingPointElement(points[0]));



for (let i = 0; i < POINT_COUNT; i++) {
  render(siteListElement, createPoint(points[i]), `beforeend`);
}


render(siteContentElement, createTripInformationElement(), `afterbegin`);

