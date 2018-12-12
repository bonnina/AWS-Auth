const connectToDatabase = require('../DB');
const User = require('../user/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');

/* functions */

module.exports.signup = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return connectToDatabase()
    .then(() =>
      register(JSON.parse(event.body))
    )
    .then(res => ({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(res)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message
    }));
};

/* Helpers */

function signToken(id) {
  return jwt.sign({ name: id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

function register(reqBody) {
  const salt = 10;
  return  User.findOne({ email: reqBody.email }) 
    .then(user =>
      user
        ? Promise.reject(new Error('User with that email exists.'))
        : bcrypt.hash(reqBody.password, salt)
    )
    .then(hash =>
      User.create({ username: reqBody.name, email: reqBody.email, password: hash }) 
     )
    .then(user => ({ auth: true, token: signToken(user.username) })); 
}