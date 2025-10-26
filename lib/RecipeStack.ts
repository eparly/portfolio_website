import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
export class RecipeWebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const recipesTable = new Table(this, 'RecipesTable', {
      partitionKey: { name: 'recipeId', type: AttributeType.STRING },
      tableName: 'RecipesTable',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
      
    const recipesBucket = new Bucket(this, 'RecipesBucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
    });

    const addRecipeLambda = new NodejsFunction(this, 'AddRecipeFunction', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      // code: Code.fromAsset('../../backend/routes/recipes/POST/'),
      entry: 'backend/routes/recipes/POST/handler.ts',
      environment: {
				TABLE_NAME: recipesTable.tableName,
				BUCKET_NAME: recipesBucket.bucketName,
      },
    });

    const getRecipeLambda = new NodejsFunction(this, 'GetRecipeFunction', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: 'backend/routes/recipes/{id}/GET/handler.ts',
      environment: {
				TABLE_NAME: recipesTable.tableName,
				BUCKET_NAME: recipesBucket.bucketName,
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
		
		const deleteRecipeLambda = new NodejsFunction(this, 'DeleteRecipeFunction', {
			runtime: Runtime.NODEJS_20_X,
			handler: 'handler',
			entry: 'backend/routes/recipes/{id}/DELETE/handler.ts',
			environment: {
				TABLE_NAME: recipesTable.tableName,
			},
		});

    recipesTable.grantReadData(getRecipeLambda);
    recipesTable.grantReadData(getRecipesLambda);
		recipesTable.grantReadWriteData(addRecipeLambda);
		recipesTable.grantReadWriteData(deleteRecipeLambda);
		
    recipesBucket.grantReadWrite(addRecipeLambda);
    recipesBucket.grantRead(getRecipeLambda);
    const api = new RestApi(this, 'RecipeApi', {
      restApiName: 'Recipe Service',
      description: 'This service serves recipes.',
    });
    const recipesResource = api.root.addResource('recipes');
    const recipeResource = recipesResource.addResource('{id}');
		recipeResource.addMethod('GET', new LambdaIntegration(getRecipeLambda));
		recipeResource.addMethod('DELETE', new LambdaIntegration(deleteRecipeLambda));
    recipesResource.addMethod('POST', new LambdaIntegration(addRecipeLambda));
    recipesResource.addMethod('GET', new LambdaIntegration(getRecipesLambda));
	}
}