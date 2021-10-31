const SocketIO = require("socket.io");
const {
  cors: { allowedOrigin },
} = require("./config");
module.exports = (server, app) => {
  const io = SocketIO(server, {
    path: "/socket.io",
    cors: {
      origin: allowedOrigin,
    },
    serveClient: false, //TODO: 클라이언트에서 socket 설치하면 false 로 바꿔주기
  });
  app.set("io", io);
  io.on("connection", (socket) => {
    console.log("새로운 클라이언트 접속!");
    socket.on("disconnect", () => {
      console.log(socket.id, " 접속 해제");
    });
  });
};
