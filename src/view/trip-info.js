import AbstractView from "./abstract.js";

const COUNT_TRIP_CITY = 3;

const ItemValue = {
  FISRT: 0,
  LENGTH_ZERO: 0
};

const createTripInfoElement = (points) => {

  const getTripInfo = () => {
    let info = ``;

    if (points.length !== ItemValue.LENGTH_ZERO) {
      if (points.length <= COUNT_TRIP_CITY) {
        info = points.map((point) => point.city).join(` &mdash; `);
      } else {
        info = `${points[ItemValue.FISRT].city} &mdash; ... &mdash; ${points[points.length - 1].city}`;
      }
    }

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

class TripInfoView extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoElement(this._point);
  }
}

export default TripInfoView;
