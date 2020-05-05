// You can access the following resource attributes as environment variables from your Lambda function
// var environment = process.env.ENV;
var region = process.env.REGION;
var TableName = process.env.API_AMPLIFYAGORA_USERTABLE_NAME;
// var apiAmplifyagoraUserTableArn = process.env.API_AMPLIFYAGORA_USERTABLE_ARN;
// var apiAmplifyagoraGraphQLAPIIdOutput = process.env.API_AMPLIFYAGORA_GRAPHQLAPIIDOUTPUT;

const { DynamoDB } = require('aws-sdk');
var dynamodb = new DynamoDB({ region });

/**
 * @param {object} event
 * @param {string} event.triggerSource - "PostConfirmation_ConfirmSignUp"
 * @param {string} event.userName - "user1"
 * @param {string} event.request.userAttributes.sub - "12345678-aaaa-bbbb-cccc-123456789012"
 */
exports.handler = async (event, context) => {
  console.log('Auth Post Confirmation', 'addToDynamo event:', JSON.stringify(event, null, '  '));
  console.log('Auth Post Confirmation', 'addToDynamo TableName:', TableName);
  console.log('Auth Post Confirmation', 'addToDynamo env:', Object.keys(process.env));

  const userName = event.userName;
  const userId = getProperty(event, 'request', 'userAttributes', 'sub');
  const now = (new Date()).toISOString();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#updateItem-property
  // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html
  const result = dynamodb.updateItem({
    TableName,
    Key: {
      id: { S: userId }
    },
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-UpdateExpression
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.SET.PreventingAttributeOverwrites
    UpdateExpression: `
      SET userName = :userName
      SET createdAt = if_not_exists(createdAt, :now)
      SET modifiedAt = :now
    `,
    ExpressionAttributeValues: {
      ':userName': { S: userName },
      ':now': { S: now },
    }
  }).promise();

  console.log('Auth Post Confirmation', 'addToDynamo result:', JSON.stringify(result, null, '  '));

  return event;
};

function getProperty(object, ...keys) {
  return keys.reduce(
    (value, key) => (value && typeof value === 'object') ? value[key] : undefined,
    object
  );
}
