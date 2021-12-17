import {
  loginToOvercast,
  getOvercastFile,
} from "@tdee/overcast-functions/src/getOvercastFile";
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

  const fileSize = await getOvercastFile();

  return {
    statusCode: 200,
    headers: { "content-type": "text/plain" },
    body: `logged in successfully, file size: ${fileSize}`,
  };
};
