import { Template } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { test } from '@jest/globals';

import * as BdtCdk from "../lib/bdt-cdk-stack";

const synthesiseTestStack = (): Template => {
  const app = new cdk.App();
  const stack = new BdtCdk.BdtCdkStack(app, "TestStack");
  return Template.fromStack(stack);
};

test("creates and wires up a lambda", () => {
  const template = synthesiseTestStack();

  template.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "overcastLambda",
    MemorySize: 512,
    Runtime: "nodejs18.x",
  });
});

test("adds a rule to run lambda on cronjob", () => {
  const app = new cdk.App();
  const stack = new BdtCdk.BdtCdkStack(app, "MyTestStack");

  const lambdaId = stack.getLogicalId(
    stack.node.findChild("OvercastLambda").node.defaultChild as cdk.CfnElement
  );

  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::Events::Rule", {
    ScheduleExpression: "cron(4 3 * * ? *)",
    Targets: [
      {
        Arn: {
          "Fn::GetAtt": [lambdaId, "Arn"],
        },
      },
    ],
  });
});

test("creates an HTTP API Gateway resource", () => {
  const template = synthesiseTestStack();

  template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
    ProtocolType: "HTTP",
  });
});
