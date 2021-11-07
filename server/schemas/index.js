const mongoose = require("mongoose");
const {
  mongodb: { id, password },
  nodeEnv,
} = require("../config");
const MONGO_URL = `mongodb+srv://yun:1!Q@cluster0.ysvcr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const connect = () => {
  if (nodeEnv !== "production") {
    mongoose.set("debug", true);
  }
  mongoose.connect(
    MONGO_URL,
    {
      dbName: "heegu0311",
      useNewUrlParser: true,
    },
    (error) => {
      if (error) {
        console.log("몽고디비 연결 에러", error);
      } else {
        console.log("몽고디비 연결 성공");
      }
    }
  );
};

mongoose.connection.on("error", (error) => {
  console.error("몽고디비 연결 에러", error);
});
mongoose.connection.on("disconnected", () => {
  console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
  connect();
});

module.exports = connect;
