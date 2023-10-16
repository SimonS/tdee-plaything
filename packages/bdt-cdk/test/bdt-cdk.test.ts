import { Template } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";

import * as BdtCdk from "../lib/bdt-cdk-stack";

describe("Overcast Fetcher Functionality", () => {
  test("creates and wires up a lambda", () => {
    const app = new cdk.App();

    const stack = new BdtCdk.BdtCdkStack(app, "MyTestStack");

    const template = Template.fromStack(stack);

    template.hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "overcastLambda",
      MemorySize: 512,
      Runtime: "nodejs16.x",
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
});

describe("GitHub Releases Functionality", () => {
  test("Create an API Gateway", () => {
    const app = new cdk.App();

    const stack = new BdtCdk.BdtCdkStack(app, "MyTestStack");

    const template = Template.fromStack(stack);

    template.hasResourceProperties("AWS::ApiGateway::RestApi", {
      Name: "BdtGateway",
    });
  });

  test("API Gateway points webhooks to lambda function", () => {
    const app = new cdk.App();

    const stack = new BdtCdk.BdtCdkStack(app, "MyTestStack");

    const template = Template.fromStack(stack);

    template.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "index.handler",
      FunctionName: "gitHubLambda",
    });

    template.hasResourceProperties("AWS::ApiGateway::Method", {
      HttpMethod: "POST",
      AuthorizationType: "NONE",
      Integration: {
        IntegrationHttpMethod: "POST",
        Type: "AWS_PROXY",
      },
    });
  });
});
