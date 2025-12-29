const mongoose = require('mongoose');;

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    
    city: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    address: {
      type: String,
      trim: true
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);