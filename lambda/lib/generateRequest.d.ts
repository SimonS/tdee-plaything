import { BDTRequest } from "@tdee/types/src/bdt";
declare const generateRequest: ({ access_token: authToken, bdt_endpoint: endpoint, ...body }: BDTRequest) => {
    authToken: string;
    endpoint: string;
    body: string;
};
export default generateRequest;
