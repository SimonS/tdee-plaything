import fetch, { Response } from "node-fetch";

const postToBDT = async (
  body: string,
  endpoint: string,
  accessToken: string
): Promise<Response> =>
  fetch(endpoint, {
    method: "POST",
    body,
    headers: {
      authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

export default postToBDT;
