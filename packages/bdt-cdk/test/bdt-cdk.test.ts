import {
  expect as expectCDK,
  haveResource,
  haveResourceLike,
} from "@aws-cdk/assert";
import { CfnFunction } from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import * as BdtCdk from "../lib/bdt-cdk-stack";

test("creates and wires up a lambda", () => {
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

test("adds a rule to run lambda on cronjob", () => {
  const app = new cdk.App();

  const stack = new BdtCdk.BdtCdkStack(app, "MyTestStack");

  const lambdaId = stack.getLogicalId(
    stack.node.findChild("OvercastLambda").node.defaultChild as CfnFunction
  );

  expectCDK(stack).to(
    haveResourceLike("AWS::Events::Rule", {
      ScheduleExpression: "cron(10 3 * * ? *)",
      Targets: [
        {
          Arn: {
            "Fn::GetAtt": [lambdaId, "Arn"],
          },
        },
      ],
    })
  );
});
