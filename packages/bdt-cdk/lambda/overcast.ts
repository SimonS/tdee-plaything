import { loginToOvercast } from "@tdee/overcast-functions/src/getOvercastFile";
export const handler = async function (event: {
  email: string;
  password: string;
}) {
  return {
    statusCode: 200,
    headers: { "content-type": "text/plain" },
    body: `Overcast - ${event.email} - ${event.password}`,
  };
};
