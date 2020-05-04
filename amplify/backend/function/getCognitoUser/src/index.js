/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authAmplifyagora5af0ca94UserPoolId = process.env.AUTH_AMPLIFYAGORA5AF0CA94_USERPOOLID

Amplify Params - DO NOT EDIT */

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
const { CognitoIdentityServiceProvider } = require('aws-sdk');
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

/**
 * Get user pool information from environment variables.
 */
const COGNITO_USERPOOL_ID = process.env.AUTH_AMPLIFYAGORA5AF0CA94_USERPOOLID;
if (!COGNITO_USERPOOL_ID) {
  throw new Error(`Function requires environment variable: 'COGNITO_USERPOOL_ID'`);
}

/**
 * A resolver for GraphQL that retrieves user data from Cognito, based on the user ID that already exists on the model.
 * @param {object} event 
 * @param {object} event.source - Initial data on the GraphQL model being resolved.
 * @param {string} event.fieldName - The name of the field we're trying to resolve.
 */
exports.handler = async (event) => {
    const {fieldName, source} = event;
    
    const sourceFieldName = removeStrings(fieldName, ['Data', 'Object']); // For "ownerData", get ID from "owner".
    const userId = getValueWithSuffix(source, sourceFieldName, ['Id', 'ID', 'Sub', '']); // If sourceFieldName is "owner", try getting the ID with a few prefixes first (i.e. "ownerId").

    if (userId) {
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listUsers-property
        const result = await cognitoIdentityServiceProvider.listUsers({
            UserPoolId: COGNITO_USERPOOL_ID,
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
                username: user.Username
            };
        }
    }
    return null;
};

/**
 * Get the first value from `target` where the `key` exists with an entry in `suffixes` added.
 * @param {object} target 
 * @param {string} key 
 * @param {string[]} suffixes 
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
 * Remove the passed `removables` from the passed `str`.
 * @param {string} original 
 * @param {string[]} removables 
 */
function removeStrings(original, removables) {
    return removables.reduce( (result, removable) => result.replace(removable, ''), original );
}