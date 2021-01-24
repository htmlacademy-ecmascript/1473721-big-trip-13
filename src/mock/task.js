import dayjs from "dayjs";
import {getRandomInteger} from "../utils/common.js";

const PointType = {
  TAXI: `taxi`,
  BUS: `bus`,
  TRAIN: `train`,
  SHIP: `ship`,
  TRANSPORT: `transport`,
  DRIVE: `drive`,
  FLIGHT: `flight`,
  CHEK_IN: `check-in`,
  SIGHTSEEING: `sightseeing`,
  RESTAURANT: `restaurant`
};

const pointTypeResource = {
  [PointType.TAXI]: `Taxi`,
  [PointType.BUS]: `Bus`,
  [PointType.TRAIN]: `Train`,
  [PointType.SHIP]: `Ship`,
  [PointType.TRANSPORT]: `Transport`,
  [PointType.DRIVE]: `Drive`,
  [PointType.FLIGHT]: `Flight`,
  [PointType.CHEK_IN]: `Check-in`,
  [PointType.SIGHTSEEING]: `Sightseeing`,
  [PointType.RESTAURANT]: `Restaurant`,
};

const PointField = {
  TYPE_POINT: [
    PointType.BUS,
    PointType.TAXI,
    PointType.TRAIN,
    PointType.SHIP,
    PointType.TRANSPORT,
    PointType.DRIVE,
    PointType.FLIGHT,
    PointType.CHEK_IN,
    PointType.SIGHTSEEING,
    PointType.RESTAURANT,
  ],
  CITY_POINT: [`Gelendzhik`, `Moscow`, `St.Petersburg`, `Krasnodar`, `Sochi`, `Omsk`, `Rostov-on-Don`],
  DESCRIPTION_POINT: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`.`),
};

const DefaultValue = {
  MIN_RANDOM_VALUE: 0,
  MAX_RANDOM_VALUE: 100,
  MIN_COUNT_PHOTO: 1,
  MAX_COUNT_PHOTO: 5,
  MIN_DESCRIPTION_VALUE: 1,
  MAX_DESCRIPTION_VALUE: 4,
  FOR_THE_RIGHT_LENGTH: 1,
  MIN_PRICE_VALUE: 0,
  MAX_PRICE_VALUE: 100000,
  MIN_YEAR_VALUE: 2020,
  MAX_YEAR_VALUE: 2021,
  MIN_MONTH_VALUE: 1,
  MAX_MONTH_VALUE: 12,
  MIN_DAY_VALUE: 1,
  MAX_DAY_VALUE: 31,
  MIN_HOUR_VALUE: 1,
  MAX_HOUR_VALUE: 23,
  MIN_MINUTE_VALUE: 1,
  MAX_MINUTE_VALUE: 59,
  FOR_BOOLEAN_VALUE: 0.5,
  MIN_TIME_VALUE_HOUR: 0,
  MAX_TIME_VALUE_HOUR: 24,
  MIN_TIME_VALUE_MINUTE: 0,
  MAX_TIME_VALUE_MINUTE: 60,
  MIN_MINUTE: 0,
  MAX_MINUTE: 60
};

const SortType = {
  DAY: `sort-day`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

const getString = (arr, minValue) => arr[getRandomInteger(minValue, arr.length - DefaultValue.FOR_THE_RIGHT_LENGTH)];

const getDescription = () => {
  let randomDescription = ``;
  for (let i = 0; i < getRandomInteger(DefaultValue.MIN_DESCRIPTION_VALUE, DefaultValue.MAX_DESCRIPTION_VALUE); i++) {
    randomDescription += `${PointField.DESCRIPTION_POINT[getRandomInteger(DefaultValue.MIN_RANDOM_VALUE, PointField.DESCRIPTION_POINT.length - DefaultValue.FOR_THE_RIGHT_LENGTH)]}.`;
  }
  return randomDescription;
};

const getDescriptionPhoto = () => {
  let randomDescription = ``;
  for (let i = 0; i < getRandomInteger(1, 6); i++) {
    randomDescription += `${PointField.DESCRIPTION_POINT[getRandomInteger(DefaultValue.MIN_RANDOM_VALUE, PointField.DESCRIPTION_POINT.length - DefaultValue.FOR_THE_RIGHT_LENGTH)]}.`;
  }
  return randomDescription;
};

const getRandomPhoto = () => {
  const photos = [];
  for (let i = 0; i < getRandomInteger(DefaultValue.MIN_COUNT_PHOTO, DefaultValue.MAX_COUNT_PHOTO); i++) {
    photos.push(`http://picsum.photos/248/152?r=${getRandomInteger(DefaultValue.MIN_RANDOM_VALUE, DefaultValue.MAX_RANDOM_VALUE)}`);
  }

  return photos;
};

const getRandomPrice = () => getRandomInteger(DefaultValue.MIN_PRICE_VALUE, DefaultValue.MAX_PRICE_VALUE);

const getRandomUberPrice = () => getRandomInteger(DefaultValue.MIN_PRICE_VALUE, DefaultValue.MAX_PRICE_VALUE);

const getFavoriteState = () => Math.random() >= DefaultValue.FOR_BOOLEAN_VALUE;

const getAllDestination = () => {
  return [{
    description: getDescription(),
    name: `Gelendzhik`,
    pictures: [
      {
        src: getRandomPhoto(),
        description: getDescriptionPhoto(),
      }
    ]
  }, {
    description: getDescription(),
    name: `Moscow`,
    pictures: [
      {
        src: getRandomPhoto(),
        description: getDescriptionPhoto(),
      }
    ]
  }, {
    description: getDescription(),
    name: `St.Petersburg`,
    pictures: [
      {
        src: getRandomPhoto(),
        description: getDescriptionPhoto(),
      }
    ]
  }, {
    description: getDescription(),
    name: `Krasnodar`,
    pictures: [
      {
        src: getRandomPhoto(),
        description: getDescriptionPhoto(),
      }
    ]
  }, {
    description: getDescription(),
    name: `Sochi`,
    pictures: [
      {
        src: getRandomPhoto(),
        description: getDescriptionPhoto(),
      }
    ]
  }, {
    description: getDescription(),
    name: `Omsk`,
    pictures: [
      {
        src: getRandomPhoto(),
        description: getDescriptionPhoto(),
      }
    ]
  }, {
    description: getDescription(),
    name: `Rostov-on-Don`,
    pictures: [
      {
        src: getRandomPhoto(),
        description: getDescriptionPhoto(),
      }
    ]
  }
  ];
};

const destinations = getAllDestination();

const getDestination = (name) => {
  const destinationByName = destinations.find((destination) => destination.name === name);

  if (destinationByName) {
    return destinationByName;
  }

  return [];
};

const getOptions = (type) => {
  return [
    {
      "title": `${type.toUpperCase()}1`,
      "price": 120
    }
  ];
};

const removeDash = (type) => type.replace(`_`, `-`);

const getOffers = () => {
  return [
    {
      type: PointType.TAXI,
      offers: [
        {
          "title": `TAXI1`,
          "price": 120
        }, {
          "title": `TAXI2`,
          "price": 60
        }, {
          "title": `TAXI3`,
          "price": 70
        }
      ]
    },
    {
      type: PointType.BUS,
      offers: [
        {
          "title": `BUS1`,
          "price": 120
        }, {
          "title": `BUS2`,
          "price": 60
        }
      ]
    }, {
      type: PointType.CHEK_IN,
      offers: [
        {
          "title": `CHEK_IN1`,
          "price": 120
        }, {
          "title": `CHEK_IN2`,
          "price": 60
        }
      ]
    }, {
      type: PointType.DRIVE,
      offers: [
        {
          "title": `DRIVE1`,
          "price": 120
        }, {
          "title": `DRIVE2`,
          "price": 60
        }
      ]
    }, {
      type: PointType.FLIGHT,
      offers: [
        {
          "title": `FLIGHT1`,
          "price": 120
        }, {
          "title": `FLIGHT2`,
          "price": 60
        }
      ]
    }, {
      type: PointType.RESTAURANT,
      offers: [
        {
          "title": `RESTAURANT1`,
          "price": 120
        }, {
          "title": `RESTAURANT2`,
          "price": 60
        }
      ]
    }, {
      type: PointType.SHIP,
      offers: [
        {
          "title": `SHIP1`,
          "price": 120
        }, {
          "title": `SHIP2`,
          "price": 60
        }
      ]
    }, {
      type: PointType.SIGHTSEEING,
      offers: [
        {
          "title": `SIGHTSEEING1`,
          "price": 120
        }, {
          "title": `SIGHTSEEING2`,
          "price": 60
        }
      ]
    }, {
      type: PointType.TRAIN,
      offers: [
        {
          "title": `TRAIN1`,
          "price": 120
        }, {
          "title": `TRAIN2`,
          "price": 60
        }
      ]
    }, {
      type: PointType.TRANSPORT,
      offers: [
        {
          "title": `TRANSPORT1`,
          "price": 120
        }, {
          "title": `TRANSPORT2`,
          "price": 60
        }
      ]
    }
  ];
};

const getRandomTime = () => `${getRandomInteger(3, 27)}:${getRandomInteger(1, 59)}:${getRandomInteger(0, 59)}`;

const getRandomDate = () => `20${getRandomInteger(18, 21)}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 59)}`;

const getRandomDateFrom = () => dayjs(`${getRandomDate()}:${getRandomTime()}`).toISOString();

const getRandomDateTo = () => dayjs(`${getRandomDate()}:${getRandomTime()}`).toISOString();

const generatePoint = () => {
  const pointType = removeDash(getString(PointField.TYPE_POINT, DefaultValue.MIN_RANDOM_VALUE));
  const pointCity = getString(PointField.CITY_POINT, DefaultValue.MIN_RANDOM_VALUE);
  const dateFrom = getRandomDateFrom();
  const dateTo = getRandomDateTo();
  return {
    type: pointType,
    city: pointCity,
    options: getOptions(pointType),
    destination: getDestination(pointCity),
    dateFrom,
    dateTo,
    price: getRandomPrice(),
    uberPrice: getRandomUberPrice(),
    favorite: getFavoriteState(),
    id: new Date().valueOf()
  };
};

export {
  generatePoint,
  PointField,
  SortType,
  getOptions,
  getDescription,
  PointType,
  pointTypeResource,
  getOffers,
  destinations
};
