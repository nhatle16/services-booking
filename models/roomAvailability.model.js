const mongoose = require('mongoose');

const roomAvailabilitySchema = new mongoose.Schema(
  {
    roomTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
      index: true
    },

    date: {
      type: Date,
      required: true,
      index: true
    },

    availableRooms: {
      type: Number,
      required: true,
      min: 0
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("RoomAvailability", roomAvailabilitySchema);
