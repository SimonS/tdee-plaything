import axios from "axios";
import axiosCookieJarSupport from "axios-cookiejar-support";
import { stringify } from "querystring";
import { writeFileSync } from "fs";
import { CookieJar } from "tough-cookie";

axiosCookieJarSupport(axios);

const cookieJar = new CookieJar();
axios.defaults.jar = cookieJar;

const getOPML = async (email: string, password: string): Promise<void> => {
  const urlBase = `https://overcast.fm`;
  const http = axios.create({
    baseURL: urlBase,
    withCredentials: true,
    jar: cookieJar,
  });

  const opmlURL = `/account/export_opml/extended`;
  const loginURL = `/login`;

  const authParams = {
    then: "podcasts",

    email,
    password,
  };

  const resp = await http.post(`${urlBase}${loginURL}`, stringify(authParams));

  if (resp.request.path === "/podcasts") {
    const opmlFile = await http.get(`${urlBase}${opmlURL}`);
    writeFileSync("./extended.opml", opmlFile.data);
    return Promise.resolve();
  }
};

export default getOPML;
