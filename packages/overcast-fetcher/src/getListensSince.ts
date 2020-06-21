import { load } from "cheerio";

export type OvercastListen = {
  title: string;
  url: string;
  overcastUrl: string;
  listenDate: Date;
  podcast: {
    title: string;
    url: string;
  };
};

const getListensSince = (since: Date, xml: string): OvercastListen[] => {
  const overcastFile = load(xml, {
    xmlMode: true,
    ignoreWhitespace: true,
  });

  return overcastFile("[type='podcast-episode'][played='1']")
    .toArray()
    .map((el) => ({
      title: el.attribs["title"],
      url: el.attribs["url"],
      overcastUrl: el.attribs["overcastUrl"],
      listenDate: new Date(el.attribs["userUpdatedDate"]),
      podcast: {
        title: el.parent.attribs["title"],
        url: el.parent.attribs["htmlUrl"],
      },
    }))
    .filter((listen) => listen.listenDate > since);
};

export default getListensSince;
