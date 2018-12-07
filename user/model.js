const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const validator = email => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Required!"],
      maxlength: [50, "Too Long!"],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, "Required!"],
      validate: [validator, "Invalid email!"],
      maxlength: [50, "Too Long!"],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Required!"],
    }
  }
);


module.exports = mongoose.model("User", UserSchema);