#!/usr/bin/env node
import 'source-map-support/register'

import * as cdk from 'aws-cdk-lib'
import { FrontendStack } from '../lib/FrontendStack'
import { ApiStack } from '../lib/ApiStack'
import { RecipeWebsiteStack } from '../lib/RecipeStack'

const app = new cdk.App()

const frontendStack = new FrontendStack(app, 'FrontendStack', {
    env: {
        account: '498430199007',
        region: 'ca-central-1'
    }
})
const apiStack = new ApiStack(app, 'ApiStack')
const recipeStack = new RecipeWebsiteStack(app, 'RecipeWebsiteStack')
