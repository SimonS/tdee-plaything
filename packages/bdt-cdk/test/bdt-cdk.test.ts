import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as BdtCdk from "../lib/bdt-cdk-stack";

test("creates and writes up a lambda", () => {
  const app = new cdk.App();

  const stack = new BdtCdk.BdtCdkStack(app, "MyTestStack");

  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      FunctionName: "overcastLambda",
      MemorySize: 512,
      Runtime: "nodejs14.x",
    })
  );
});
