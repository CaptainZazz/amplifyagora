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
 * @property {string} createdAt
 * @property {string} modifiedAt
 */
/**
 * @typedef {object} CognitoUser
 * @property {string} id
 * @property {string} userName
 * @property {string} createdAt
 */

var region = getEnvVar('REGION');
var TableName = getEnvVar('API_AMPLIFYAGORA_USERTABLE_NAME');
var UserPoolId = getEnvVar('AUTH_AMPLIFYAGORA5AF0CA94_USERPOOLID');

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
const { DynamoDB, CognitoIdentityServiceProvider } = require('aws-sdk');
const dynamodb = new DynamoDB({ region, apiVersion: '2012-08-10' });
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

/**
 * A resolver for GraphQL that retrieves user data from Cognito, based on the user ID that already exists on the model.
 * Gets but the Cognito Subscription ID ('sub') because it is unique, while username can be reused.
 * @param {object} event 
 * @param {object} event.source - Initial data on the GraphQL model being resolved.
 * @param {string} event.fieldName - The name of the field we're trying to resolve.
 * @returns {DynamoUser}
 */
exports.handler = async (event) => {
    const {fieldName, source} = event;
    logVar.group('GetUser');
    
    // Get userId from sister field.
    // If this field is "ownerData", sister might be "owner".
    // If this field is "user", sister might be "userID".
    // If this field is "authorObject", sister might be "authorId".
    const sourceFieldName = removeStrings(fieldName, ['Data', 'Object']); // For "ownerData", get ID from "owner".
    const userId = getValueWithSuffix(source, sourceFieldName, ['Id', 'ID', 'Sub', '']); // If sourceFieldName is "owner", try getting the ID with a few prefixes first (i.e. "ownerId").
    logVar('input', {
        fieldName, source, userId
    });

    let result = null;
    try {
        await describeTable(TableName);

        if (userId) {
            logVar('get existing user', userId);
            result = await getDynamoUser(userId); // Get existing user data
            logVar('existing user', isEmpty(result) ? 'empty' : 'valid', result);
            if (isEmpty(result)) {
                const cognitoUser = await getCognitoUser(userId); // Get user data from cognito
                if (!isEmpty(cognitoUser)) {
                    result = await addDynamoUser(cognitoUser.id, cognitoUser.userName, cognitoUser.createdAt); // Add user data to database
                }
            }
        }
    } catch(e) {
        logVar('Error', e);
        throw e;
    }
    logVar('Return', result);
    
    logVar.groupEnd();
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

function isEmpty(obj) {
    return !obj || Object.keys(obj).length === 0;
}

/**
 * Transform a DynamoDB User Item to a response object.
 * @param {object} user 
 * @returns {DynamoUser}
 */
function transformDynamoUser(user) {
    const result = user ? {
        id: getProperty(user, 'id', 'S'),
        displayName: getProperty(user, 'displayName', 'S')
    } : null;
    logVar('transformDynamoUser', {user, result})
    return result;
}

/**
 * Get a user from Dynamo
 * @param {string} userId 
 * @returns {DynamoUser}
 */
async function getDynamoUser(userId) {
    logVar.group('getDynamoUser')('userId', userId);
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html
    
    const params = {
        TableName,
        Key: {
            id: { S: userId }
        }
    }
    logVar('params', params);
     const result = await dynamodb.getItem(params).promise();
    logVar('result', result);

    const user = isEmpty(result && result.Item) ? null : result.Item;
    logVar('user', user);
    const out = transformDynamoUser(user);
    logVar('out', out).groupEnd();
    return out;
}
/**
 * Add a user to Dynamo and return them
 * @param {string} userId 
 * @param {string} userName 
 * @returns {DynamoUser}
 */
async function addDynamoUser(userId, userName, createdAt) {
    logVar('--------------------------------').group('addDynamoUser')('input', { userId, userName, createdAt });
    logVar('createdAt type', typeof createdAt);
    const now = (new Date()).toISOString();
    /*
    const result = await dynamodb.putItem({
        TableName,
        ReturnValues: 'ALL_NEW',
        // Key: {
        //     id: { S: userId }
        // },
        // // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#DDB-UpdateItem-request-UpdateExpression
        // // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.SET.PreventingAttributeOverwrites
        // UpdateExpression: `
        //     SET userName = :userName
        //     SET createdAt = if_not_exists(createdAt, :now)
        //     SET modifiedAt = :now
        // `,
        // ExpressionAttributeValues: {
        //     ':userName': { S: userName },
        //     ':now': { S: (new Date()).toISOString() },
        // }
        Item: {
            id: { S: userId },
            userName: { S: userName },
            createdAt: { S: now },
            modifiedAt: { S: now },
        }
    });
    */
   const params = {
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
    }
    logVar('putItem params', params);
    const result = await dynamodb.updateItem(params).promise();
    logVar('putItem result', result);
    logVar('putItem result keys', Object.keys(result));
    logVar('putItem result params', result.params);
    const user = isEmpty(result && result.Attributes) ? null : result.Attributes;
    logVar('user', user);
    const out = transformDynamoUser(user);
    logVar('out', out).groupEnd();
    return out;
}

/**
 * Get a user from Cognito
 * @param {string} userId 
 * @returns {CognitoUser}
 */
async function getCognitoUser(userId) {
    logVar.group('getCognitoUser')('userId', userId);
    const result = await cognitoIdentityServiceProvider.listUsers({
        UserPoolId,
        Filter: `sub="${userId}"`,
        Limit: 1
    }).promise();
    logVar('listUsers result', result);

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
    logVar('user', user);
    let out = null;

    if (user && user.UserStatus && user.UserStatus !== 'ARCHIVED') {
        out = {
            id: userId,
            userName: user.Username,
            createdAt: user.UserCreateDate.toISOString()
        };
    }
    logVar('out', out).groupEnd();
    return out
}

/**
 * Log a variable
 * @param {string} label 
 * @param {*} value 
 */
function logVar(label, value) {
    const groups = logVar._groups.join('') || '';
    if (arguments.length > 1) {
        try {
            value = JSON.stringify(value, null, 2);
        } catch(e) {}
        console.log(groups, label+':', value);
    } else {
        console.log(groups, label);
    }
    return logVar;
}
logVar.group = function(name) {
    logVar._groups.push('['+name+']');
    return logVar;
}
logVar.groupEnd = function() {
    logVar._groups.pop();
    return logVar;
}
logVar._groups = [];

async function describeTable(TableName) {
    logVar.group('describeTable')('TableName', TableName);
    try {
        const result = await dynamodb.describeTable({TableName}).promise();
        logVar('Result', result).groupEnd();
        return result;
    } catch (e) {
        logVar('Error', e.message).groupEnd();
        throw e;
    }
}

// TODO Error handling