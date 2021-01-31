import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";

dayjs.extend(duration);

const DEFAULT_DATES_RANGE = 2;

export const ValueForRandom = {
  ZERO: 0,
  HUNDRED: 100
};

export const ValueForDuuration = {
  MIN_VALUE: 0,
  VALUE_FOR_DIFF: 10
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `fututre`,
  PAST: `past`
};


export const getPhoto = (photos) => {
  const reducer = (element, photo) => element + `<img class="event__photo" src="${photo}" alt="Event photo">`;

  let imgElement = ``;

  return photos.reduce(reducer, imgElement);
};

export const formDate = (value, format) => dayjs(value).format(format);

export const sortByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
export const sortByTime = (pointA, pointB) => dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom)) - dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
export const sortByPrice = (pointA, pointB) => pointA.price - pointB.price;

export const getDuration = (dateFrom, dateTo) => {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  const diffDuration = dayjs.duration(diff);

  const days = diffDuration.days();
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();

  const ifLessThenTen = (value) => {
    if (value < ValueForDuuration.VALUE_FOR_DIFF) {
      return `0${value}`;
    }
    return value;
  };

  let durationToRender = ``;

  if (days > ValueForDuuration.MIN_VALUE) {
    durationToRender += `${ifLessThenTen(days)}D `;
  }
  if (hours >= ValueForDuuration.MIN_VALUE) {
    durationToRender += `${ifLessThenTen(hours)}H `;
  }
  if (minutes >= ValueForDuuration.MIN_VALUE) {
    durationToRender += `${ifLessThenTen(minutes)}M`;
  }

  return durationToRender;
};

export const getDefaultPointDates = (range = DEFAULT_DATES_RANGE) => {
  const start = dayjs();
  const end = start.add(range, `hours`);

  return {start: start.toISOString(), end: end.toISOString()};
};
