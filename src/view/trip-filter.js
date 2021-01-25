import Smart from "./smart.js";

const getFilters = (filters, currentFilter) => {
  debugger;
  return filters.reduce((acc, filter) => {

    const checkedValue = filter.type === currentFilter ? `checked` : ``;

    acc += ` <div class="trip-filters__filter">
    <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}" ${checkedValue}>
    <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.name}</label>
  </div>`;

    return acc;
  }, ``);
};

const createTripFilterElement = (filters, currentFilter) =>
  `<form class="trip-filters" action="#" method="get">
  ${getFilters(filters, currentFilter)}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;

export default class TripFilterView extends Smart {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFilterElement(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
