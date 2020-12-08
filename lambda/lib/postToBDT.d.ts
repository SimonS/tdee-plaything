import { Response } from "node-fetch";
declare const postToBDT: (body: string, endpoint: string, accessToken: string) => Promise<Response>;
export default postToBDT;
