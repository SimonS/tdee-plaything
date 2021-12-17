import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda-nodejs";
import * as apiGateway from "@aws-cdk/aws-apigateway";

export class BdtCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloLambda = new lambda.NodejsFunction(this, "HelloLambda", {
      entry: "./lambda/hello.ts",
      functionName: "helloLambda",
      handler: "handler",
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
    });

    new apiGateway.LambdaRestApi(this, "HelloApi", {
      handler: helloLambda,
    });
  }
}
