import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { stringify } from "querystring";
import { CookieJar } from "tough-cookie";

const cookieJar = new CookieJar();
axios.defaults.jar = cookieJar;

export const loginToOvercast = async (email: string, password: string) => {
  const urlBase = `https://overcast.fm`;
  const http = wrapper(
    axios.create({
      baseURL: urlBase,
      withCredentials: true,
      jar: cookieJar,
    })
  );

  const loginURL = `/login`;

  const authParams = {
    then: "podcasts",
    email,
    password,
  };

  const resp = await http.post(`${urlBase}${loginURL}`, stringify(authParams));

  return resp.request.path === "/podcasts";
};

export default () => {};
