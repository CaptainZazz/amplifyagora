exports.handler = (event, context, callback) => {
  // insert code to be executed by your lambda trigger
  console.log('Auth Post Confirmation', 'addToDynamo', JSON.stringify(event, null, '  '));
  callback(null, event);
};
