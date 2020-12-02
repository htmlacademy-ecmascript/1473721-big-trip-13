import { createElement } from "../util.js";

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
        info = points.map(point => point.city).join(` &mdash; `);
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

class TripInfoView {
  constructor(points) {
    this._element = null;
    this._points = points;
  }

  getTemplate() {
    return createTripInfoElement(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default TripInfoView;
