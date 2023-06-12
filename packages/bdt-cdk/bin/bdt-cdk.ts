#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { BdtCdkStack } from "../lib/bdt-cdk-stack";

const app = new App();
new BdtCdkStack(app, "BdtCdkStack");
