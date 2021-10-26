const mongoose = require("mongoose");

const { Schema } = mongoose;
const notificationSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("notification", notificationSchema);
