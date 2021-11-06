const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatLog = new Schema({
  id: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
});
const chatSchema = new Schema({
  _id: {
    type: Number,
    required: true,
  }, // mysql의 gatheringId가 들어감
  chatInfo: {
    type: Object, // 타이틀, 스포츠 (한글), 스포츠 이모지,
  },
  chatLog: {
    type: [chatLog],
    required: true,
    // default: [{ user: "userid", message: "새로운 모임이 만들어졌습니다.", date: Date() },] //{id, userId, nickname, image, date}
  },
  creatorId: {
    type: String,
    required: true,
  },
});

chatSchema.statics.typeChat = async function (room, _id, userId, message, date) {
  const AddedChatInfo = await this.findOneAndUpdate(
    { _id: room },
    {
      $push: { chatLog: { _id, id: userId, message, date } },
    },
    { returnDocument: "after" }
  );

  return AddedChatInfo.chatInfo;
};

module.exports = mongoose.model("Chat", chatSchema);
