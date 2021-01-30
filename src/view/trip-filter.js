import Smart from "./smart.js";

const getFilters = (filters, currentFilter) => {
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

export default class TripFilter extends Smart {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
  }

  getTemplate() {
    return createTripFilterElement(this._filters, this._currentFilter);
  }

  onSetFilterTypeChange(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._onFilterTypeChange);
  }

  _onFilterTypeChange(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
