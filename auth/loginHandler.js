const connectToDatabase = require('../DB');
const User = require('../user/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');

/* function */

module.exports.login = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      logIn(JSON.parse(event.body))
    )
    .then(res => ({
      statusCode: 200,
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
  return User.findOne({ email: reqBody.email })
    .then(user =>
      !user
        ? Promise.reject(new Error('User with this email does not exit.'))
        : comparePassword(reqBody.password, user.password, user.username)
    )
    .then(token => ({ auth: true, token: token }));
}

function comparePassword(reqPassword, userPassword, username) {
  return bcrypt.compare(reqPassword, userPassword)
    .then(isValid =>
      !isValid
        ? Promise.reject(new Error('Credentials do not match.'))
        : jwt.sign({ name: username }, process.env.JWT_SECRET, { expiresIn: '1d' })
    );
}