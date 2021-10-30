const mongoose = require("mongoose");
const { Schema } = mongoose;
const chatSchema = new Schema({
  _id: {
    type: Number,
    required: true,
  }, // mysql의 gatheringId가 들어감
  gatheringInfo: {
    type: Object, // 타이틀, 스포츠 (한글), 스포츠 이모지,
  },
  chatLog: {
    type: Array,
    required: true,
    // default: [{ user: "userid", message: "새로운 모임이 만들어졌습니다.", date: Date() },] //{id, userId, nickname, image, date}
  },
  creatorId: {
    type: String,
    required: true,
  }, // 유저 회원탈퇴 시 같이 삭제
});

module.exports = mongoose.model("Chat", chatSchema);
