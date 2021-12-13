import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { stringify } from "querystring";
import { CookieJar } from "tough-cookie";
import { writeFileSync, statSync } from "fs";

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

export const getOvercastFile = async () => {
  const opmlURL = `/account/export_opml/extended`;
  const opmlFile = await http.get(`${urlBase}${opmlURL}`);

  writeFileSync("/tmp/extended.opml", opmlFile.data);

  return statSync("/tmp/extended.opml").size;
};
