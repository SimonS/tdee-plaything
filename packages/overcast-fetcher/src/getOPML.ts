import axios from "axios";
import axiosCookieJarSupport from "axios-cookiejar-support";
import { stringify } from "querystring";

import { CookieJar } from "tough-cookie";

axiosCookieJarSupport(axios);

const cookieJar = new CookieJar();
axios.defaults.jar = cookieJar;

const getOPML = async (): Promise<void> => {
  const EMAIL = process.env.OVERCAST_EMAIL || "";
  const PASSWORD = process.env.OVERCAST_PASSWORD || "";
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

    email: EMAIL,
    password: PASSWORD,
  };

  await http.post(`${urlBase}${loginURL}`, stringify(authParams), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const opmlResponse = await http.get(`${urlBase}${opmlURL}`);
  console.log(opmlResponse.data);
};

export default getOPML;
