const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    from: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },

    to: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Flight", flightSchema);