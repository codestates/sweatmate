import { io } from "socket.io-client";

const baseURL = process.env.REACT_APP_BASE_URL;

class MainSocket {
  constructor() {
    this.io = io(baseURL, {
      withCredentials: true,
    });
    this.io.on("disconnect", () => {
      mainSocket = null;
    });
    // this.io.on("connect_error", (err) => {
    //   console.log("socket error", err.message);
    // });
  }

  // connect() {
  //   if (!this.io.connected) {
  //     return this.io.connect();
  //   }
  // }
  // onSync(event, callback) {
  //   if (!this.io.connected) {
  //     this.io.connect();
  //   }
  //   this.io.on(event, (message) => callback(message));
  //   return () => this.io.off(event);
  // }
}

class ChatSocket {
  constructor(room) {
    const url = `${baseURL}/chat`;
    this.io = io(url, {
      withCredentials: true,
      forceNew: true,
      query: {
        room,
      },
    });
    this.io.on("disconnect", (_) => {
      chatSocket = null;
    });
  }
}

let mainSocket;
export function getMainSocketIO() {
  if (!mainSocket) {
    mainSocket = new MainSocket();
  }
  return mainSocket.io;
}

let chatSocket;
export function getChatSocketIO(room) {
  if (!chatSocket) {
    chatSocket = new ChatSocket(room);
  }
  return chatSocket.io;
}
export function removeChatSocket() {
  chatSocket = null;
}
