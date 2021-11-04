const SocketIO = require("socket.io");
const cookie = require("cookie");
const {
  cors: { allowedOrigin },
} = require("./config");
const { verifyAccessToken } = require("./controllers/functions/token");

module.exports = (server, app) => {
  const io = SocketIO(server, {
    path: "/socket.io",
    cors: {
      origin: allowedOrigin,
      credentials: true,
    },
    serveClient: false, // TODO: 클라이언트에서 socket 설치하면 false 로 바꿔주기
  });

  io.use(async (socket, next) => {
    const { jwt } = cookie.parse(socket.handshake.headers.cookie || "");
    if (!jwt) {
      return next(new Error("Authentication error"));
    }
    const decoded = await verifyAccessToken(jwt);
    if (!decoded) {
      return next(new Error("Authentication error"));
    }
    next();
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("🔥 새로운 클라이언트 접속!", socket.id);
    socket.on("disconnect", () => {
      console.log("❌ 클라이언트 접속 해제!", socket.id);
    });
  });
  const chatNamespace = io.of("/chat");
  chatNamespace.on("connection", (socket) => {
    console.log("🔥 /chat 새로운 클라이언트 접속!", socket.id);
    socket.on("disconnect", () => {
      console.log("❌ /chat 클라이언트 접속 해제!", socket.id);
    });
  });
};
