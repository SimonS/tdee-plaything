import { BDTRequest, JSONObject } from "@tdee/types/src/bdt";

// payload, strips out access token and endpoint and returns each aspect separated
const generateRequest = ({
  access_token: authToken,
  bdt_endpoint: endpoint,
  ...body
}: BDTRequest): JSONObject => ({
  authToken,
  endpoint: `https://breakfastdinnertea.co.uk${endpoint}`,
  body: JSON.stringify(body),
});

export default generateRequest;
