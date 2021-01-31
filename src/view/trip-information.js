import Smart from "./smart.js";
import {sortByDay} from "../utils/task.js";
import {formDate} from "../utils/task.js";

const COUNT_TRIP_CITY = 3;
const NUMBER_FOR_ARRAY = 1;
const ZERO = 0;
const NO_NAME = `no name`;

const getCost = (points) => {
  return points.reduce((acc, point) => {
    if (point.options) {
      point.options.forEach((offers) => {
        acc += (offers.price || ZERO);
      });
    }
    acc += point.price;
    return acc;
  }, null);
};

const createTripInfoElement = (points) => {
  const first = 0;
  const last = points.length - NUMBER_FOR_ARRAY;

  points.sort(sortByDay);

  const getTripInfo = () => {
    let info = ``;

    if (points.length <= COUNT_TRIP_CITY) {
      info = points.map((point) => point.destination ? point.destination.name : NO_NAME).join(` &mdash; `);
    } else {
      info = `${points[first].destination.name} &mdash; ... &mdash; ${points[last].destination.name}`;
    }
    return info;
  };

  let sectionInformation = ``;

  sectionInformation = `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripInfo()}</h1>

      <p class="trip-info__dates">${points[first] ? formDate(points[first].dateFrom, `DD MMM`) : ``}&nbsp;&mdash;&nbsp;${points[last] ? formDate(points[last].dateTo, `DD MMM`) : ``}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getCost(points)}</span>
    </p>
  </section>`;

  return sectionInformation;
};

export default class TripInformation extends Smart {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;
    this._data = {points: pointsModel.getPoints()};

    this._onModelEvent = this._onModelEvent.bind(this);
  }

  getTemplate() {
    if (this._data.points.length !== 0) {
      return createTripInfoElement(this._data.points);
    } else {
      return ` `;
    }
  }

  restoreHandlers() {
    return;
  }

  init() {
    this._pointsModel.addObserver(this._onModelEvent);
  }

  _onModelEvent() {
    this.updateData({points: this._pointsModel.getPoints()});
  }
}
