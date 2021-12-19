import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { stringify } from "querystring";
import { CookieJar } from "tough-cookie";
import { load } from "cheerio";

const cookieJar = new CookieJar();
axios.defaults.jar = cookieJar;

const urlBase = `https://overcast.fm`;
const http = wrapper(
  axios.create({
    baseURL: urlBase,
    withCredentials: true,
    jar: cookieJar,
  })
);

export interface OvercastListen {
  pubDate: Date;
  title: string;
  overcastUrl: string;
  sourceUrl: string;
  url?: string;
  userUpdatedDate: Date;
  feedUrl: string;
}

export const loginToOvercast = async (email: string, password: string) => {
  const loginURL = `/login`;

  const authParams = {
    then: "podcasts",
    email,
    password,
  };

  const resp = await http.post(`${urlBase}${loginURL}`, stringify(authParams));

  return resp.request.path === "/podcasts";
};

export const getOvercastListens = async (
  since?: Date
): Promise<OvercastListen[]> => {
  const opmlURL = `/account/export_opml/extended`;
  const opmlFile = await (await http.get(`${urlBase}${opmlURL}`)).data;

  const overcastFile = load(opmlFile, {
    xmlMode: true,
  });

  const plays = overcastFile("[type='podcast-episode'][played=1]")
    .toArray()
    .map((el) => ({
      pubDate: new Date(el.attribs["pubDate"]),
      title: el.attribs["title"],
      overcastUrl: el.attribs["overcastUrl"],
      sourceUrl: el.attribs["enclosureUrl"],
      url: el.attribs["url"],
      userUpdatedDate: new Date(el.attribs["userUpdatedDate"]),
      feedUrl: overcastFile(el).parent().attr("xmlUrl") || "",
    }));

  return since ? plays.filter((play) => play.userUpdatedDate > since) : plays;
};
