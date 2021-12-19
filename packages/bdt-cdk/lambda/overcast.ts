import {
  loginToOvercast,
  getOvercastListens,
} from "@tdee/overcast-functions/src/getOvercastListens";

export const handler = async function (event: {
  email: string;
  password: string;
}) {
  const result = await loginToOvercast(event.email, event.password);

  if (!result) {
    return {
      statusCode: 401,
      body: "Login failed",
    };
  }

  // get listens since yesterday, play it safe, I'll dedupe on the data's side
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const listens = await getOvercastListens(yesterday);

  return {
    statusCode: 200,
    headers: { "content-type": "text/plain" },
    body: JSON.stringify(listens),
  };
};
