import {
  createElement
} from "../util.js";

const COUNT_TRIP_CITY = 3;

const ItemItem = {
  FISRT: 0,
  THIRD: 2
};

const createTripInfoElement = (points) => {

  const getTripInfo = () => {
    let info = ``;

    if (points.length !== 0) {
      if (points.length <= 3) {
        for (let i = 0; i < COUNT_TRIP_CITY; i++) {
          info += `${points[i].city} `;

          if (i !== points.length - 1) {
            info += `&mdash; `;
          }
        }
      } else {
        info = `${points[ItemItem.FISRT].city} &mdash; ... &mdash; ${points[ItemItem.THIRD].city}`;
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

export {
  TripInfoView
};


