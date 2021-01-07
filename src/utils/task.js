import dayjs from "dayjs";
import {getRandomInteger} from "./common.js";

const ValueForRandom = {
  ZERO: 0,
  HUNDRED: 100
};

export const getPhoto = (photos) => {
  const reducer = (element, photo) => element + `<img class="event__photo" src="${photo}" alt="Event photo">`;

  let imgElement = ``;

  return photos.reduce(reducer, imgElement);
};

export const getOffers = (options) => {
  const reducer = (element, option) => element + `<div class="event__offer-selector">
         <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option}-1" type="checkbox"
           name="event-offer-${option}" checked>
         <label class="event__offer-label" for="event-offer-${option}-1">
           <span class="event__offer-title">${option}</span>
           &plus;&euro;&nbsp;
           <span class="event__offer-price">${getRandomInteger(ValueForRandom.ZERO, ValueForRandom.HUNDRED)}</span>
         </label>
       </div>`;

  let offersElement = ``;

  return options.reduce(reducer, offersElement);
};

export const formDate = (value, format) => dayjs(value).format(format);

export const sortByDay = (pointA, pointB) => {
  // console.log(dayjs(pointA.day).diff(dayjs(pointB.day)));
  return dayjs(pointA.day).diff(dayjs(pointB.day));
};
export const sortByPrice = () => {console.log(`price`)};
export const sortByTime = () => {console.log(`time`)};
