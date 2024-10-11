const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
  },
  federatedCredentials: {
    type: Array,
    required: [true, "Federated credentials are required"],
  },
});

module.exports = mongoose.model("User", userSchema);
