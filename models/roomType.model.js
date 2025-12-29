const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true
    },

    maxGuests: {
      type: Number,
      required: true,
      min: 1
    },

    bedType: {
      type: String,
      enum: ["single", "double", "queen"],
    },

    sizeSqm: {
      type: Number
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      required: true,
      default: "CAD"
    },

    totalRooms: {
      type: Number,
      required: true,
      min: 1
    }
  },

  { timestamps: true }
)

module.exports = mongoose.model("RoomType", roomTypeSchema);