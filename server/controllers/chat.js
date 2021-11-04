const mongooseChatModel = require("../schemas/chat");
const {
  findGatheringOfUser,
  userFindOne,
  gatheringFindOne,
  getVaildGatheringId,
} = require("./functions/sequelize");
const { DBERROR, getCurrentTime } = require("./functions/utility");
module.exports = {
  getUserChatList: async (req, res) => {
    const { userId } = res.locals;
    try {
      //유저 아이디로 참여중인 게더링아이디를 찾는 함수입니다.
      const usersGatheringIds = await getVaildGatheringId({ userId });

      // 참여중인 게더링이 없을 경우에 응답입니다.
      if (!usersGatheringIds.length) {
        return res.status(200).json([]);
      }
      // 게더링 아이디로 mongoDB에서 채팅 인포를 가져옵니다.
      const chatsList = await mongooseChatModel.find(
        { _id: usersGatheringIds },
        { chatLog: { $slice: -1 }, chatInfo: 1, creatorId: 1 }
      );
      // 응답으로 보내줄 데이터를 api문서에 맞게 가공하는 로직입니다.
      const chatsListToSend = await Promise.all(
        chatsList.map(async (el) => {
          const { chatLog: recentChat, _id: gatheringId, chatInfo, creatorId } = el;
          const date = recentChat[0]?.date;
          // 채팅로그가 비어있을 경우에 응답입니다.
          if (!date) {
            recentChat[0] = { message: null, nickname: null, date: null };
            return { gatheringId, chatInfo, creatorId, recentChat };
          }
          // 유저 아이디로 MYSQL에서 user테이블의 유저 정보를 조회합니다.
          const { id: recentUserId, message } = recentChat[0];
          const userInfo = await userFindOne({ id: recentUserId });
          const recentChatInfo = { message };
          recentChatInfo.nickname = userInfo.dataValues.nickname;
          // recentChatInfo.image = userInfo.dataValues.image;
          // 최근에 대화한 시간에 따라서 "날짜", "시간", "어제" 로 나눠서 보내주는 로직입니다.
          const [curDay, curTime] = (currentDay = getCurrentTime().split(" "));
          const [day, time] = recentChat[0].date.split(" ");
          const oneDayToMillisecond = 86400000;
          if (curDay === day) {
            recentChatInfo.date = time;
          } else if (new Date(curTime) - new Date(day) === oneDayToMillisecond) {
            recentChatInfo.date = "어제";
          } else {
            recentChatInfo.date = day;
          }
          return { gatheringId, chatInfo, creatorId, recentChat: [recentChatInfo] };
        })
      );
      res.status(200).json(chatsListToSend);
    } catch (err) {
      DBERROR(res, err);
    }
  },
  joinChatingRoom: async (req, res) => {
    // 채팅 아이디로 gathering done필드를 확인 또는 현재 시간과 게더링 date비교후에 하루가 지났으면  진입 불가.
    // 채팅 로그들, 참여자 목록(id, image,nickname),  더링 정보(이모지,스포츠. 타이틀)
    const { userId } = res.locals; // 게더링 아이디에 유저가 정말 참여중인 조회 용도
    const { gatheringId } = req.params;
    let checkParticipating = false;
    try {
      // 게더링 채팅에 입장 시에 게더링이 종료되지 않았나 체크하는 로직입니다.
      const gatheringInfo = await gatheringFindOne({ id: gatheringId });
      const { done, date } = gatheringInfo;
      const gatheringSetDay = +new Date(date);
      const currentDay = +new Date(getCurrentTime().split(" ")[0]);
      if (done === 1 || gatheringSetDay < currentDay) {
        return res.status(400).json({ message: "already ended gathering" });
      }
      // 채팅에 접속한 유저가 게더링에 참여중인지 체크합니다.
      const gatheringListOfUser = await findGatheringOfUser({ gatheringId });
      gatheringListOfUser.forEach((el) => {
        if (el.userId === userId) {
          checkParticipating = true;
        }
      });
      if (!checkParticipating) {
        return res.status(400).json({ message: "not participating in this gathering" });
      }
      //채팅의 유저 리스트 (아이디, 닉네임, 이미지)를 불러옵니다.
      const participatingUserList = await Promise.all(
        gatheringListOfUser.map(async (el) => {
          const userInfo = await el.getUser();
          const { id, image, nickname } = userInfo;
          return { id, image, nickname };
        })
      );
      // mongoDB 에서 게더링 채팅방을 불러와 채팅 내역 요소들에 유저의 닉네임, 이미지, 아이디를 추가로 부여합니다.
      const userList = {}; // 가져온 유저정보의 id값을 키로 nickname과 image 를 저장합니다.
      participatingUserList.forEach((el) => {
        userList[el.id] = { image: el.image, nickname: el.nickname };
      });
      const chatInfobyGatheringId = await mongooseChatModel.findOne({ _id: gatheringId }).lean();
      const { _id, chatInfo, chatLog, creatorId } = chatInfobyGatheringId;
      const translatedChatLog = chatLog.map((el) => {
        let userInfo = userList[el.userId];
        el.id = el.userId;
        delete el.userId;
        if (!userInfo) {
          el.id = null;
          userInfo = { image: null, nickname: "모임을 나간 유저" };
        }
        return { ...userInfo, ...el };
      });
      res.status(200).json({
        gatheringId: _id,
        userList: participatingUserList,
        chatLog: translatedChatLog,
        chatInfo,
        creatorId,
      });
    } catch (err) {
      DBERROR(res, err);
    }
  },
};
