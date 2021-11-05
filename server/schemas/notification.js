const mongoose = require("mongoose");
// type = ["welcome", "new", "ban", "join", "leave", "done", "notice"]
const { Schema } = mongoose;
const notificationListSchema = new Schema({
  id: {
    type: Number,
    default: null,
  },
  type: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    default: null,
  },
  target: {
    type: String,
    default: null,
  },
  message: {
    type: String,
  },
});
const notificationSchema = new Schema({
  // mysql 유저의 uuid 값을 넣어줌
  _id: {
    type: String,
    required: true,
  },
  // 알림목록들
  notification: [notificationListSchema],
});

module.exports = mongoose.model("notification", notificationSchema);
