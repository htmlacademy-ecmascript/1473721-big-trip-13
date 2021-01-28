import AbstractView from "./abstract.js";

const COUNT_TRIP_CITY = 3;

const ItemValue = {
  FISRT: 0,
  LENGTH_ZERO: 0
};

const createTripInfoElement = (points) => {

  const getTripInfo = () => {
    let info = ``;

    // if (points.length !== ItemValue.LENGTH_ZERO) {
    //   if (points.length <= COUNT_TRIP_CITY) {
    //     info = points.map((point) => point.destination.name).join(` &mdash; `);
    //   } else {
    //     info = `${points[ItemValue.FISRT].destination.name} &mdash; ... &mdash; ${points[points.length - 1].destination.name}`;
    //   }
    // }

    return info;
  };
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getTripInfo()}</h1>

    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
  </p>
</section>`;
};

export default class TripInfoView extends AbstractView {
  constructor(pointsModel) {
    super();
    // this._pointsModel = pointsModel;
    this._pointsModel = null;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoElement(this._pointsModel);
  }
}
