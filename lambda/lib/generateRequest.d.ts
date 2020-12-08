import { BDTRequest, JSONObject } from "@tdee/types/src/bdt";
declare const generateRequest: ({ access_token: authToken, bdt_endpoint: endpoint, ...body }: BDTRequest) => JSONObject;
export default generateRequest;
