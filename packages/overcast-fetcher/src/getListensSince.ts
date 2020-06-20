import { load } from "cheerio";

type OvercastListen = {
  title: string;
  url: string;
  overcastUrl: string;
  listenDate: Date;
};

const getListensSince = (since: Date, xml: string): OvercastListen[] => {
  const overcastFile = load(xml, {
    xmlMode: true,
    ignoreWhitespace: true,
  });

  return overcastFile("[type='podcast-episode']")
    .toArray()
    .map((el) => ({
      title: el.attribs["title"],
      url: el.attribs["url"],
      overcastUrl: el.attribs["overcastUrl"],
      listenDate: new Date(el.attribs["userUpdatedDate"]),
    }));
};

export default getListensSince;
