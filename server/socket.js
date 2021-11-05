const SocketIO = require("socket.io");
const cookie = require("cookie");
const {
  cors: { allowedOrigin },
} = require("./config");
const { verifyAccessToken } = require("./controllers/functions/token");
const { getVaildGatheringId } = require("./controllers/functions/sequelize");
const { typeChat, createNotification } = require("./controllers/functions/mongoose");

module.exports = (server, app) => {
  const realTime = app.get("realTime");
  const io = SocketIO(server, {
    path: "/socket.io",
    cors: {
      origin: allowedOrigin,
      credentials: true,
    },
    serveClient: true, // TODO: 클라이언트에서 socket 설치하면 false 로 바꿔주기
  });
  const main = io.of("/");
  const chat = io.of("/chat");
  app.set("main", main);
  app.set("chat", chat);

  main.use(async (socket, next) => {
    const { jwt } = cookie.parse(socket.handshake.headers.cookie || "");
    if (!jwt) {
      return next(new Error("Authentication error"));
    }
    const decoded = await verifyAccessToken(jwt);
    if (!decoded) {
      return next(new Error("Authentication error"));
    }
    // 로그인 후 소켓 연결 시 소켓 객체에 유저 아이디를 저장
    socket.userId = decoded.id;
    // 유저 아이디로부터 참여중인 게더링(done=0) 아이디들을 전부 불러온 후 전부 룸으로 참여시킴.
    const roomIds = getVaildGatheringId(decoded.id);
    socket.join(roomIds);
    next();
  });

  chat.use(async (socket, next) => {
    const { jwt } = cookie.parse(socket.handshake.headers.cookie || "");
    if (!jwt) {
      return next(new Error("Authentication error"));
    }
    const decoded = await verifyAccessToken(jwt);
    if (!decoded) {
      return next(new Error("Authentication error"));
    }
    socket.userId = decoded.id;
    //채팅방에 입장시에 소켓에 유저 아이디를 저장
    const room = socket.handshake.query.room;
    // 소켓을 해당 입장하려는 룸에 입장시킴
    // 유저 관리 객체에 해당 유저 상태를 1로 변경
    realTime[room][decoded.id] = 1;
    socket.join(room);
    socket.curRoom = room;
    next();
  });

  main.on("connection", (socket) => {
    console.log("🔥 새로운 클라이언트 접속!", socket.id);

    /* Client TODO: 채팅방에 입장, 나갈 때  클라이언트에서 메인 네임스페이스에서 해당 이벤트를 발생시켜줘야 함!
      chat 네임스페이스에서는 메인 소켓을 모름! */
    socket.on("leaveMainRoom", (room) => {
      socket.leave(room);
    });
    socket.on("leaveChatRoom", (room) => {
      socket.join(room);
    });
    socket.on("signout", () => {
      main.in(socket.id).disconnectSockets();
    });

    socket.on("disconnect", () => {
      console.log("❌ 클라이언트 접속 해제!", socket.id);
    });
  });

  chat.on("connection", (socket) => {
    console.log("🔥 /chat 새로운 클라이언트 접속!", socket.id);
    //Client TODO: 메시지 보낼 때 emit("message", userInfo:{id, nickname,image}, message)
    socket.on("message", async (userInfo, message) => {
      // 채팅창에 접속중인 유저들에 대한 이벤트

      const { id, nickname, image } = userInfo;
      const { _id, date, gatheringInfo } = await typeChat(1, 1, message);
      chat.to(socket.curRoom).emit("message", { _id, id, message, nickname, image, date });

      // 채팅창 밖의 유저들에 대한 이벤트

      // const userList = Object.keys(realTime[socket.curRoom]).filter((el) => {
      //   return obj[socket.curRoom][el] === 0;
      // });

      // 유저들의 notification 스키마에 추가될 이벤트
      // 유저아이디들이 부여되는데 서버는 유저 하나하나가 누군지 모르기 때문에 objectID를 전달 불가능한 듯 하다
      // 상의하기

      // userList.forEach(async (userId) => {
      //   const {
      //     _id,
      //     id: gatheringId,
      //     type,
      //     url,
      //     target,
      //     message,
      //   } = await createNotification(
      //     userId,
      //     socket.curRoom,
      //     "new",
      //     `/chat/${socket.curRoom}`,
      //     null,
      //     `${gatheringInfo.title} 모임에서 새로운 메시지가 있습니다.`
      //   );
      // });

      main.to(socket.curRoom).emit("Notice", {
        url: `/chat/${socket.curRoom}`,
        gatheringId: socket.curRoom,
        type: "new",
        message: `${gatheringInfo.title} 모임에서 새로운 메시지가 있습니다.`,
      });
    });

    socket.on("disconnect", (socket) => {
      console.log("❌ /chat 클라이언트 접속 해제!", socket.id);
      realTime[socket.curRoom][socket.userId] = 0;
    });
  });
};
