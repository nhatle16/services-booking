const mongoose = require('mongoose');


const flightScheduleSchema = new mongoose.Schema(
  {
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
      index: true
    },

    departureTime: {
      type: Date,
      required: true
    },

    arrivalTime: {
      type: Date,
      required: true
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      required: true,
      default: "CAD"
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["available", "full", "cancelled"],
      default: "available"
    }
  },

  { timestamps: true }
);