import dayjs from "dayjs";
import {FilterType} from "./task.js";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => {
    const timeStamp = new Date().valueOf();
    return dayjs(point.dateFrom).valueOf() > dayjs(timeStamp);
  }),
  [FilterType.PAST]: (points) => points.filter((point) => {
    const timeStamp = new Date().valueOf();
    return dayjs(point.dateFrom).valueOf() < dayjs(timeStamp);
  })
};
