const { Schema, model } = require("mongoose");

const billSchema = new Schema(
  {
    number: Number,
    // number: String,
    // date: Date


    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },

  },
  {
    timestamps: true,
  }
);

const Bill = model("Bill", billSchema);

module.exports = Bill;
