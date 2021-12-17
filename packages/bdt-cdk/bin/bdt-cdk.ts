#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { BdtCdkStack } from '../lib/bdt-cdk-stack';

const app = new cdk.App();
new BdtCdkStack(app, 'BdtCdkStack');
