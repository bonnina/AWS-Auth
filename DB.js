const mongoose = require('mongoose');
let connected;

module.exports = connectToDatabase = () => {
  if (connected) {
    console.log('using previous database connection');
    return Promise.resolve();
  }

  console.log('using new database connection');
  return mongoose.connect(process.env.DB, { useNewUrlParser: true }) 
    .then(db => { 
      connected = db.connections[0].readyState;
    });
};