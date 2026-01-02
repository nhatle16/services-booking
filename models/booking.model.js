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

    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
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

bookingSchema.pre("validate", function (next) {
  // Validate required fields for flight booking
  if (this.bookingType === "flight" && !this.flightScheduleId) {
    return next(new Error("Flight booking requires flightScheduleId"));
  }

  // Validate required fields for hotel booking
  if (this.bookingType === "hotel") {
    if (!this.roomTypeId || !this.checkInDate || !this.checkOutDate) {
      return next(new Error("Hotel booking requires roomTypeId, checkInDate, and checkOutDate"));
    }

    if (this.checkOutDate <= this.checkInDate) {
      return next(new Error("checkOutDate must come after checkInDate."));
    }
  }

  next();
})

module.exports = mongoose.model("Booking", bookingSchema);