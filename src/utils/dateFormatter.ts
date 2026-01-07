
export const DATE_FORMAT = "DD/MM/YYYY";

import dayjs from "dayjs";


export const formatDate = (date?: string | Date) => {
  if (!date) return "-";
  return dayjs(date).format(DATE_FORMAT);
};