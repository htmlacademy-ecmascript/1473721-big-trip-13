import FilterView from "../view/trip-filter.js";
import {render, replace, remove} from "../utils/render.js";

import {FilterType} from "../utils/task.js";
import {UpdateType} from "../const.js";

export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._onModelEvent = this._onModelEvent.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);

    this._pointsModel.addObserver(this._onModelEvent);
    this._filterModel.addObserver(this._onModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.onSetFilterTypeChange(this._onFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _onModelEvent() {
    this.init();
  }

  _onFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: `Everything`
      },
      {
        type: FilterType.FUTURE,
        name: `Future`
      },
      {
        type: FilterType.PAST,
        name: `Past`,
      }
    ];
  }
}
