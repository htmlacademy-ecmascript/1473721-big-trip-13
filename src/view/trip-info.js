const COUNT_TRIP_CITY = 3;

const ItemItem = {
  FISRT: 0,
  THIRD: 2
};

export const createTripInfoElement = (points) => {

  const getTripInfo = () => {
    let info = ``;

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


