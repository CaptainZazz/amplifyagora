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
 * @typedef {object} User
 * @property {string} id
 * @property {string} userName
 */

var region = getEnvVar('REGION');
var TableName = getEnvVar('API_AMPLIFYAGORA_USERTABLE_NAME');
var UserPoolId = getEnvVar('AUTH_AMPLIFYAGORA5AF0CA94_USERPOOLID');

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
const { CognitoIdentityServiceProvider } = require('aws-sdk');
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

const { DynamoDB } = require('aws-sdk');
var dynamodb = new DynamoDB({ region });

/**
 * A resolver for GraphQL that retrieves user data from Cognito, based on the user ID that already exists on the model.
 * @param {object} event 
 * @param {object} event.source - Initial data on the GraphQL model being resolved.
 * @param {string} event.fieldName - The name of the field we're trying to resolve.
 * @returns {User}
 */
exports.handler = async (event) => {
    const {fieldName, source} = event;
    
    // Get userId from sister field.
    // If this field is "ownerData", sister might be "owner".
    // If this field is "user", sister might be "userID".
    // If this field is "authorObject", sister might be "authorId".
    const sourceFieldName = removeStrings(fieldName, ['Data', 'Object']); // For "ownerData", get ID from "owner".
    const userId = getValueWithSuffix(source, sourceFieldName, ['Id', 'ID', 'Sub', '']); // If sourceFieldName is "owner", try getting the ID with a few prefixes first (i.e. "ownerId").
    
    let result = null;
    if (userId) {
        result = getDynamoUser(userId); // Get existing user data
        if (!result) {
            const cognitoUser = getCognitoUser(userId); // Get user data from cognito
            result = addDynamoUser(cognitoUser.id, cognitoUser.userName); // Add user data to database
        }
    }
    return result;
};

/**
 * Get the first value from `target` where the `key` exists with an entry in `suffixes` added.
 * @param {object} target 
 * @param {string} key 
 * @param {string[]} suffixes 
 * @returns {*}
 */
function getValueWithSuffix(target, key, suffixes) {
    for (let i=0; i < suffixes.length; i++) {
        const current = key + suffixes[i];
        if (target.hasOwnProperty(current)) {
            return target[current];
        }
    }
    return null;
}

/**
 * Get a required environment variable.
 * @param {string} name 
 * @returns {string}
 */
function getEnvVar(name) {
    const variable = process.env[name];
    if (!variable) throw new Error(`Function requires environment variable: '${name}'.`);
    return variable;
}

/**
 * Remove the passed `removables` from the passed `str`.
 * @param {string} original 
 * @param {string[]} removables 
 * @returns {string}
 */
function removeStrings(original, removables) {
    return removables.reduce( (result, removable) => result.replace(removable, ''), original );
}

/**
 * Get a value from an object by its keys.
 * @param {object} object 
 * @param  {...string} keys 
 * @returns {*}
 */
function getProperty(object, ...keys) {
    return keys.reduce(
        (value, key) => (value && typeof value === 'object') ? value[key] : undefined,
        object || {}
    );
}

/**
 * Transform a DynamoDB User Item to a response object.
 * @param {object} user 
 * @returns {User}
 */
function transformDynamoUser(user) {
    return user ? {
        id: getProperty(user, 'id', 'S'),
        userName: getProperty(user, 'userName', 'S')
    } : null;
}

/**
 * Get a user from Dynamo
 * @param {string} userId 
 * @returns {User}
 */
async function getDynamoUser(userId) {
    const result = await dynamodb.getItem({
        TableName,
        Key: {
            id: { S: userId }
        }
    }).promise();

    const user = result && result.Item;
    logVar('getDynamoUser', { userId, result, user });
    return transformDynamoUser(user);
}
/**
 * Add a user to Dynamo and return them
 * @param {string} userId 
 * @param {string} userName 
 * @returns {User}
 */
async function addDynamoUser(userId, userName) {
    const result = await dynamodb.putItem({
        TableName,
        ReturnValues: 'ALL_NEW',
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
            ':now': { S: (new Date()).toISOString() },
        }
    });
    const user = result && result.Attributes;
    logVar('getDynamoUser', { userId, userName, result, user });
    return transformDynamoUser(user);
}

/**
 * Get a user from Cognito
 * @param {string} userId 
 * @returns {User}
 */
async function getCognitoUser(userId) {
    if (userId) {
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

        if (user && user.UserStatus && user.UserStatus !== 'ARCHIVED') {
            return {
                id: userId,
                userName: user.Username
            };
        }
    }
    return null
}

/**
 * Log a variable
 * @param {string} label 
 * @param {*} value 
 */
function logVar(label, value) {
    console.log('GetUser', label, JSON.stringify(value, null, 2));
}