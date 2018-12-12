const connectToDatabase = require('../DB');
const User1 = require('../user/model_no_email');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');

/* function */

module.exports.signin = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return connectToDatabase()
    .then(() =>
      logIn(JSON.parse(event.body))
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
      body: { stack: err.stack, message: err.message }
    }));
};

/* helpers */

function logIn(reqBody) {
  return User1.findOne({ username: reqBody.username })
    .then(user =>
      !user
        ? Promise.reject(new Error('User with this username does not exit.'))
        : comparePassword(reqBody.password, user.password, user.username)
    )
    .then(token => ({
      success: true,
      err: null,
      token: token 
    }));
}

function comparePassword(reqPassword, userPassword, name) {
  return bcrypt.compare(reqPassword, userPassword)
    .then(isValid =>
      !isValid
        ? Promise.reject(new Error('Credentials do not match.'))
        : jwt.sign({ username: name }, process.env.JWT_SECRET, { expiresIn: '1d' })
    );
}