exports.handler = async (event, context) => {
    console.log('GetConfig', {
        event, context, env: Object.keys(process.env)
    });
    return {
        userId: (event.identity && event.identity.sub) || null,
        // region: process.env.REGION,
        // env: process.env.ENV,
    };
};
