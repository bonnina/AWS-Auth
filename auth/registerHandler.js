const connectToDatabase = require('../DB');
const User1 = require('../user/model_no_email');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');

/* function */

module.exports.register = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  return connectToDatabase()
  .then(() =>
    registerUser(JSON.parse(event.body))
  )
  .then(res => ({
    statusCode: 200,
    body: JSON.stringify(res)
  }))
  .catch(err => ({
    statusCode: err.statusCode || 500,
    body: JSON.stringify(err.message)
  }));
};


/* Helpers */

function signToken(name) {
  return jwt.sign({ username: name }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

function registerUser(reqBody) {
  const salt = 10;
  return  User1.findOne({ username: reqBody.username }) 
    .then(user =>
      user
        ? Promise.reject(new Error('User with this name already exists.'))
        : bcrypt.hash(reqBody.password, salt)
    )
    .then(hash =>
      User1.create({ username: reqBody.username, password: hash }) 
    )
    .then(user => ({
      success: true,
      err: null,
      token: signToken(user.username)
    })); 
}