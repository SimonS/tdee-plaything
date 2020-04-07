import fetch from "node-fetch";
import * as dateformat from "dateFormat";

const getBinDays = async (date?: Date): Promise<[]> => {
  if (!date) {
    date = new Date(Date.now());
  }
  const apiRoot =
    "http://applications.rochdale.gov.uk/RefuseCollectionCalendar/Home/CollectionDates";
  const UPRN = "23016840";
  const formattedDate = dateformat(date, "dd/mm/yyyy");

  return await fetch(
    `${apiRoot}?UPRN=${UPRN}&selectedDate=${formattedDate}`
  ).then(res => res.json());
};

export default getBinDays;
