const {auth} = require('../amplify/backend/amplify-meta.json');
const color = require('./color');

console.log(`${color.FgYellow}%s${color.FgCyan}%s${color.Reset}`, 'User Pool Client ID: ', Object.values(auth).pop().output.AppClientIDWeb);
