const connectToDatabase = require('../DB');
const User = require('./model');

/* functions */

module.exports.getUsers = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(getAllUsers)
    .then(users => ({
      statusCode: 200,
      body: JSON.stringify(users)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ message: err.message })
    }));
};

/* helpers */

function getAllUsers() {
  return User.find({})
    .then(users => users)
    .catch(err => Promise.reject(new Error(err)));
}