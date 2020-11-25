import {createMenuTemplate} from "./view/menu.js";
import {createTripInfoElement} from "./view/trip-info.js";
import {createTripInformationElement} from "./view/trip-information.js";
import {createTripFilterElement} from "./view/trip-filter.js";
import {createTripSortElement} from "./view/trip-sort.js";
import {createPointElement} from "./view/creature-point.js";
import {createTripEventListElement} from "./view/trip-event-list.js";
import {createEditingPointElement} from "./view/editing-points.js";
import {createPoint} from "./view/point.js";

const POINT_COUNT = 3;


const menuElement = document.querySelector(`.trip-main`);
const menuHeaderElement = menuElement.querySelector(`h2`);
const filterElement = menuElement.querySelector(`.trip-main__trip-controls`);

const siteMainElement = document.querySelector(`.page-body__page-main`);
const siteContentElement = siteMainElement.querySelector(`.trip-events`);


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(menuElement, createTripInfoElement(), `afterbegin`);
render(menuHeaderElement, createMenuTemplate(), `afterend`);
render(filterElement, createTripFilterElement(), `beforeend`);
render(siteContentElement, createTripSortElement(), `beforeend`);

render(siteContentElement, createTripEventListElement(), `beforeend`);
const siteListElement = siteMainElement.querySelector(`.trip-events__list`);
render(siteListElement, createPointElement(), `beforeend`);
render(siteListElement, createEditingPointElement(), `beforeend`);

for (let i = 0; i < POINT_COUNT; i++) {
  render(siteListElement, createPoint(), `beforeend`);
}

render(siteContentElement, createTripInformationElement(), `afterbegin`);



