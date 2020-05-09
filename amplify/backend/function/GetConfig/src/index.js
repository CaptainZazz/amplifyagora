/**
 * Gets config details needed for the App.
 * Provides a 'userId' for the 'getConfig' query to attach the 'getUser' Resolver to the 'user' field.
 * @param {object} event
 * @param {string} event.type - From resolvers/Query.getConfig.Request.vtl - "Query"
 * @param {string} event.field - From resolvers/Query.getConfig.Request.vtl - "getConfig"
 * @param {object} event.identity - The logged in user
 * @param {string} event.identity.sub - The Cognito user Subject
 * @param {string} event.identity.username - The Cognito username
 */
exports.handler = async (event) => {
    return {
        userId: (event.identity && event.identity.sub) || null,
        userName: (event.identity && event.identity.username) || null,

        env: process.env.ENV,
        region: process.env.REGION
    };
};
