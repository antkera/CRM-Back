const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // Validación básica de email
    },
    password: {
      type: String,
      required: true
    },
    billingInfo: {
      companyName: {
        type: String,
        required: true
      },
      dniOrCif: {
        type: String,
        required: true,
        match: /^[0-9]{8}[A-Z]|[A-Z0-9]{9}$/  // Validación para DNI o CIF
      },
      address: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // Validación básica de email
      },
      phone: {
        type: String,
        required: true
      }
    },
    clients: [{
      type: Schema.Types.ObjectId,
      ref: 'Client'
    }],
    bills: [{
      type: Schema.Types.ObjectId,
      ref: 'Invoice'
    }]
  },

  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
