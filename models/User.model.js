const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    bills: [{ type: Schema.Types.ObjectId, ref: "Bill" }],
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    password: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
