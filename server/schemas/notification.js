const mongoose = require("mongoose");

const { Schema } = mongoose;
const notificationSchema = new Schema({
  // mysql 유저의 uuid 값을 넣어줌
  _id: {
    type: String,
    required: true,
  },
  // 알림목록들
  notification: {
    type: Array,
  },
});

module.exports = mongoose.model("notification", notificationSchema);
