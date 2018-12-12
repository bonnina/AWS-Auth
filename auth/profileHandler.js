const connectToDatabase = require('../DB');
const User = require('../user/model');

/* function */

module.exports.profile = (event, context) => {
  console.log(event.requestContext.authorizer);
  
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      findUser(event.requestContext.authorizer.principalId) 
    )
    .then(session => ({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: { stack: err.stack, message: err.message }
    }));
};

/* helper */

function findUser(name) {
  return User.findOne({ username: name })
    .then(user =>
      !user
        ? Promise.reject('No user found.')
        : user
    )
    .catch(err => Promise.reject(new Error(err)));
}