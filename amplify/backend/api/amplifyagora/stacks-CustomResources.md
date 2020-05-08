
# Resources
* [API Category Project Structure](https://docs.amplify.aws/cli/graphql-transformer/overview#api-category-project-structure)
* [Custom Resolvers Documentation](https://docs.amplify.aws/cli/graphql-transformer/resolvers#add-a-custom-resolver-that-targets-an-aws-lambda-function)
* [Add a custom resolver that targets an AWS Lambda function](https://docs.amplify.aws/cli/graphql-transformer/resolvers#add-a-custom-resolver-that-targets-an-aws-lambda-function)

## GetUserLambdaDataSource
Add the `GetUser` Lambda function as an AppSync DataSource in the stack's Resources block. 
## GetUserLambdaDataSourceRole
Create an AWS IAM role that allows AppSync to invoke the `GetUser` Lambda function on your behalf to the stack's Resources block.
## QueryGetConfigResolver
Create an AppSync Resolver in the stack’s Resources block.
