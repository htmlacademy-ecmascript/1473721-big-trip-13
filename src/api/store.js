export default class Store {
  constructor(storePointsKey, storeOffersKey, storeDestinationKey, storage) {
    this._storage = storage;
    this._storePointsKey = storePointsKey;
    this._storeOffersKey = storeOffersKey;
    this._storeDestinationKey = storeDestinationKey;
  }

  getPointsItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storePointsKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setPointsItems(items) {
    this._storage.setItem(
        this._storePointsKey,
        JSON.stringify(items)
    );
  }

  getOffersItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeOffersKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setOffersItems(items) {
    this._storage.setItem(
        this._storeOffersKey,
        JSON.stringify(items)
    );
  }

  getDestinationItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeDestinationKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setDestinationItems(items) {
    this._storage.setItem(
        this._storeDestinationKey,
        JSON.stringify(items)
    );
  }

  setPointItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storePointsKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  removePointItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storePointsKey,
        JSON.stringify(store)
    );
  }
}
