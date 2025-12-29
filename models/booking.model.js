const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    bookingType: {
      type: String,
      enum: ['flight', 'hotel'],
      required: true
    },

    flightScheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlightSchedule",
      default: null
    },

    roomTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      default: null
    },

    checkInDate: {
      type: Date,
    },

    checkOutDate: {
      type: Date
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed'
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);