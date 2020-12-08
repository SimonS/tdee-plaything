import { APIGatewayEvent, Context } from "aws-lambda";
export declare function handler(event: APIGatewayEvent, context: Context): Promise<{
    statusCode: number;
    headers: {
        "Content-Type": string;
    };
    body: string;
}>;
