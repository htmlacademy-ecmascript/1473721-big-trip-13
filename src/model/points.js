import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    this._points = this._points.filter((point) => point.id !== update.id);
    this._notify(updateType);
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          price: point.base_price,
          dateFrom: point.date_from,
          dateTo: point.date_to,
          favorite: point.is_favorite,
          options: point.offers
        }
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.offers;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "base_price": point.price,
          "date_from": point.dateFrom,
          "date_to": point.dateTo,
          "is_favorite": point.favorite,
          "offers": point.options
        }
    );

    delete adaptedPoint.price;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.favorite;
    delete adaptedPoint.options;

    return adaptedPoint;
  }
}
