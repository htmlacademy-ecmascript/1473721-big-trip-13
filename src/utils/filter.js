import dayjs from "dayjs";
import {FilterType} from "./task.js";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom).valueOf() > dayjs(new Date()).valueOf()),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateFrom).valueOf() < dayjs(new Date()).valueOf()),
};
