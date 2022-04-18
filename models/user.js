const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      min: 3,
      max: 30,
    },
    last_name: {
      type: String,
      required: true,
      min: 3,
      max: 30,
    },
    email_id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile_number: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
      max: 50,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
