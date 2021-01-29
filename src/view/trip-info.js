import Smart from "./smart.js";
import {sortByDay} from "../utils/task.js";
import {formDate} from "../utils/task.js";

const COUNT_TRIP_CITY = 3;

// const ItemValue = {
//   FISRT: 0,
//   LENGTH_ZERO: 0,
//   LAST:
// };

const createTripInfoElement = (points) => {

  const ItemValue = {
    FISRT: 0,
    LENGTH_ZERO: 0,
    LAST: points.length - 1
  };
  points.sort(sortByDay);

  const getTripInfo = () => {
    let info = ``;

    if (points.length !== ItemValue.LENGTH_ZERO) {
      if (points.length <= COUNT_TRIP_CITY) {
        info = points.map((point) => point.destination.name).join(` &mdash; `);
      } else {
        info = `${points[ItemValue.FISRT].destination.name} &mdash; ... &mdash; ${points[points.length - 1].destination.name}`;
      }
    }

    return info;
  };

  const getCost = () => {
    let cost = 0;
    points.forEach((point) => {
      cost += point.price;
    });
    return cost;
  };
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getTripInfo()}</h1>

    <p class="trip-info__dates">${points[ItemValue.FISRT] ? formDate(points[ItemValue.FISRT].dateFrom, `DD MMM`) : ``}&nbsp;&mdash;&nbsp;${points[ItemValue.LAST] ? formDate(points[ItemValue.LAST].dateFrom, `DD MMM`) : ``}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getCost()}</span>
  </p>
</section>`;
};

export default class TripInfoView extends Smart {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;
    this._element = null;
  }

  updateView(price, dateFrom) {
    this.updateData(price, dateFrom);
  }

  restoreHandlers() {
    return;
  }

  getTemplate() {
    return createTripInfoElement(this._pointsModel.getPoints());
  }
}
