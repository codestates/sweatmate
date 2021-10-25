const mongoose = require("mongoose");

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;
const chatSchema = new Schema({
  room: {
    type: ObjectId,
    required: true,
    ref: "Room",
  },
  creatorId: {
    type: String,
    required: true,
  },
  usersId: Array,
  chatLog: Array,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
