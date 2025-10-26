import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

export type ApiStackDeps = {
    table: ITable
}

export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, deps?: ApiStackDeps, props?: StackProps) {
        super(scope, id, props)

        const tableName = cdk.Fn.importValue('NbaTableName')
        const table = dynamodb.Table.fromTableName(this, 'NbaTable', tableName)

        const predictorLambda = new NodejsFunction(this, 'GetPredictionsRoute', {
            runtime: Runtime.NODEJS_20_X,
            handler: 'handler',
            entry: 'backend/routes/predictions/{date}/handler.ts',
            environment: {
                TABLE_NAME: tableName
            },
            timeout: cdk.Duration.seconds(10)
        })

        const resultsLambda = new NodejsFunction(this, 'GetResultsRoute', {
            runtime: Runtime.NODEJS_20_X,
            handler: 'handler',
            entry: 'backend/routes/results/{date}/handler.ts',
            environment: {
                TABLE_NAME: tableName
            },
            timeout: cdk.Duration.seconds(10)
        })

        const recordLambda = new NodejsFunction(this, 'GetRecordRoute', {
            runtime: Runtime.NODEJS_20_X,
            handler: 'handler',
            entry: 'backend/routes/record/handler.ts',
            environment: {
                TABLE_NAME: tableName
            },
            timeout: cdk.Duration.seconds(10)
        })

        const picksLambda = new NodejsFunction(this, 'GetValuePicksRoute', {
            runtime: Runtime.NODEJS_20_X,
            handler: 'handler',
            entry: 'backend/routes/picks/value/{date}/handler.ts',
            environment: {
                TABLE_NAME: tableName
            },
            timeout: cdk.Duration.seconds(10)
        })

        const evPicksLambda = new NodejsFunction(this, 'GetEVPicksRoute', {
            runtime: Runtime.NODEJS_20_X,
            handler: 'handler',
            entry: 'backend/routes/picks/ev/{date}/handler.ts',
            environment: {
                TABLE_NAME: tableName
            },
            timeout: cdk.Duration.seconds(10)
        })

        const api = new RestApi(this, 'nbaApi', {
            restApiName: 'NBA API',
            description: 'This service serves NBA predictions'
        })

        api.root.addResource('predictions').addResource('{date}').addMethod('GET', new LambdaIntegration(predictorLambda))
        api.root.addResource('results').addResource('{date}').addMethod('GET', new LambdaIntegration(resultsLambda))
        api.root.addResource('record').addMethod('GET', new LambdaIntegration(recordLambda))
        
        const picksResource = api.root.addResource('picks');

        picksResource.addResource('value').addResource('{date}').addMethod('GET', new LambdaIntegration(picksLambda));
        picksResource.addResource('ev').addResource('{date}').addMethod('GET', new LambdaIntegration(evPicksLambda));

        table.grantReadData(predictorLambda)
        table.grantReadData(resultsLambda)
        table.grantReadData(recordLambda)
        table.grantReadData(picksLambda)
        table.grantReadData(evPicksLambda)
    }

}