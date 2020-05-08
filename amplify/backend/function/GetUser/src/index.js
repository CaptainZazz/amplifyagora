/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authAmplifyagora5af0ca94UserPoolId = process.env.AUTH_AMPLIFYAGORA5AF0CA94_USERPOOLID
var apiAmplifyagoraUserTableName = process.env.API_AMPLIFYAGORA_USERTABLE_NAME
var apiAmplifyagoraUserTableArn = process.env.API_AMPLIFYAGORA_USERTABLE_ARN
var apiAmplifyagoraGraphQLAPIIdOutput = process.env.API_AMPLIFYAGORA_GRAPHQLAPIIDOUTPUT

Amplify Params - DO NOT EDIT */

/**
 * @typedef {object} DynamoUser
 * @property {string} id
 * @property {string} displayName
 */
/**
 * @typedef {object} CognitoUser
 * @property {string} id
 * @property {string} userName
 * @property {string} createdAt
 */

const { getValueWithSuffix, getEnvVar, removeStrings, getProperty, isEmpty } = require('./misc');

const Region = getEnvVar('REGION');
const TableName = getEnvVar('API_AMPLIFYAGORA_USERTABLE_NAME');
const UserPoolId = getEnvVar('AUTH_AMPLIFYAGORA5AF0CA94_USERPOOLID');

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
const { DynamoDB, CognitoIdentityServiceProvider } = require('aws-sdk');
const dynamodb = new DynamoDB({ region: Region, apiVersion: '2012-08-10' });
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

/**
 * A resolver for GraphQL that retrieves user data from Cognito, based on the user ID that already exists on the model.
 * Gets but the Cognito Subscription ID ('sub') because it is unique, while username can be reused.
 * @param {object} event 
 * @param {boolean} event.getLoggedInUser - If we want to get data for the logged in user.
 * @param {string} event.fieldName - The name of the field we're trying to resolve.
 * @returns {DynamoUser}
 */
exports.handler = async (event) => {
    console.log('GetUser event', event);
    let userId = null;
    if (event.getLoggedInUser) {
        userId = getProperty(event, 'identity', 'sub');
    } else if (event.fieldName) {
        userId = getUserIdFromField(event);
    }
    console.log('GetUser input', { userId, Region, TableName });

    let result = null;
    try {
        if (userId) {
            result = await getDynamoUser(userId); // Get existing user data
            if (isEmpty(result)) {
                console.log('GetUser Get from Cognito', userId);
                const cognitoUser = await getCognitoUserById(userId); // Get user data from cognito
                if (!isEmpty(cognitoUser)) {
                    console.log('GetUser Add to Dynamo', userId, cognitoUser.userName);
                    result = await addDynamoUser(cognitoUser.id, cognitoUser.userName, cognitoUser.createdAt); // Add user data to database
                } else {
                    console.log('GetUser User does not exist', userId);
                }
            }
        } else {
            console.log('No userId');
        }
    } catch(e) {
        console.log('GetUser error', userId, e);
        throw e;
    }
    console.log('GetUser result', userId, result);
    return result;
};

/**
 * Get userId from sister field.
 * If this field is "ownerData", sister might be "owner".
 * If this field is "user", sister might be "userID".
 * If this field is "authorObject", sister might be "authorId".
 * @param {object} event 
 * @param {string} event.fieldName - The name of the field we're trying to resolve.
 * @param {object} event.source - Initial data on the GraphQL model being resolved.
 */
function getUserIdFromField(event) {
    const {fieldName, source} = event;
    const sourceFieldName = removeStrings(fieldName, ['Data', 'Object']); // For "ownerData", get ID from "owner".
    return getValueWithSuffix(source, sourceFieldName, ['Id', 'ID', 'Sub', '']); // If sourceFieldName is "owner", try getting the ID with a few prefixes first (i.e. "ownerId").
}

/**
 * Transform a DynamoDB User Item to a response object.
 * @param {object} user 
 * @returns {DynamoUser}
 */
function transformDynamoUser(user) {
    return user ? {
        id: getProperty(user, 'id', 'S'),
        displayName: getProperty(user, 'displayName', 'S')
    } : null;
}

/**
 * Get a user from Dynamo
 * @param {string} userId 
 * @returns {DynamoUser}
 */
async function getDynamoUser(userId) {
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html
    const params = {
        TableName,
        Key: {
            id: { S: userId }
        }
    }
    const result = await dynamodb.getItem(params).promise();
    const user = isEmpty(result && result.Item) ? null : result.Item;
    return transformDynamoUser(user);
}
/**
 * Add a user to Dynamo and return them
 * @param {string} userId 
 * @param {string} userName 
 * @returns {DynamoUser}
 */
async function addDynamoUser(userId, userName, createdAt) {
    const result = await dynamodb.updateItem({
        TableName,
        ReturnValues: 'ALL_NEW',
        Key: {
            id: { S: userId }
        },
        // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-UpdateExpression
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.SET.PreventingAttributeOverwrites
        UpdateExpression: 'SET ' +[
            'displayName = if_not_exists(displayName, :displayName)',
            'createdAt = if_not_exists(createdAt, :createdAt)',
            'modifiedAt = :now',
        ].join(', '),
        ExpressionAttributeValues: {
            ':displayName': { S: userName },
            ':createdAt': { S: createdAt },
            ':now': { S: (new Date()).toISOString() },
        }
    }).promise();
    const user = isEmpty(result && result.Attributes) ? null : result.Attributes;
    return transformDynamoUser(user);
}

/**
 * Get a user from Cognito
 * @param {string} userId 
 * @returns {CognitoUser}
 */
async function getCognitoUserById(userId) {
    // https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ListUsers.html
    const result = await cognitoIdentityServiceProvider.listUsers({
        UserPoolId,
        Filter: `sub="${userId}"`,
        Limit: 1
    }).promise();
    /* {
        Attributes: [
            {Name: "sub", Value: "00001111-aaaa-bbbb-cccc-111122223333"}, 
            {Name: "email", Value: "user1@example.com"}
        ],
        Enabled: true,
        UserCreateDate: "2020-01-00T00:00:00.000Z",
        UserLastModifiedDate: "2020-01-00T00:00:00.000Z",
        UserStatus: "CONFIRMED",
        Username: "user1"
    } */
    const user = result.Users.pop();
    if (user) {
        return {
            id: userId,
            userName: user.Username,
            createdAt: user.UserCreateDate.toISOString()
        };
    }
    return null
}
