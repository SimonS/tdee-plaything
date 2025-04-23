export const handler = async (event: any): Promise<any> => {
  console.log("Strava Receiver Lambda invoked");
  console.log(JSON.stringify(event, null, 2));

  return { statusCode: 200, body: "OK" };
};
