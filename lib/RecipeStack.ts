import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
export class RecipeWebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const recipesTable = new Table(this, 'RecipesTable', {
      partitionKey: { name: 'recipeId', type: AttributeType.STRING },
      tableName: 'RecipesTable',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const addRecipeLambda = new NodejsFunction(this, 'AddRecipeFunction', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      // code: Code.fromAsset('../../backend/routes/recipes/POST/'),
      entry: 'backend/routes/recipes/POST/handler.ts',
      environment: {
        TABLE_NAME: recipesTable.tableName,
      },
    });

    const getRecipeLambda = new NodejsFunction(this, 'GetRecipeFunction', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: 'backend/routes/recipes/{id}/GET/handler.ts',
      environment: {
        TABLE_NAME: recipesTable.tableName,
      },
    });

    const getRecipesLambda = new NodejsFunction(this, 'GetRecipesFunction', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: 'backend/routes/recipes/GET/handler.ts',
      environment: {
        TABLE_NAME: recipesTable.tableName,
      },
    });

    recipesTable.grantReadData(getRecipeLambda);
    recipesTable.grantReadData(getRecipesLambda);
    recipesTable.grantReadWriteData(addRecipeLambda);
    const api = new RestApi(this, 'RecipeApi', {
      restApiName: 'Recipe Service',
      description: 'This service serves recipes.',
    });
    const recipesResource = api.root.addResource('recipes');
    const recipeResource = recipesResource.addResource('{id}');
    recipeResource.addMethod('GET', new LambdaIntegration(getRecipeLambda));
    recipesResource.addMethod('POST', new LambdaIntegration(addRecipeLambda));
    recipesResource.addMethod('GET', new LambdaIntegration(getRecipesLambda));
  }
}