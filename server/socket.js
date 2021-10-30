const SocketIO = require("socket.io");
module.exports = (server) => {
  const io = SocketIO(server, {
    path: "/socket.io",
    serveClient: true, //TODO: 클라이언트에서 socket 설치하면 false 로 바꿔주기
  });
  io.on("connection", (socket) => {
    console.log("새로운 클라이언트 접속!");
    socket.on("disconnect", () => {
      console.log(socket.id, " 접속 해제");
    });
  });
};
