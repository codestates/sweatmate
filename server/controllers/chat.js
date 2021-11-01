const mongooseChatModel = require("../schemas/chat");
const { findGatheringOfUser, userFindOne, gatheringFindOne } = require("./functions/sequelize");
const { DBERROR, getCurrentTime } = require("./functions/utility");
module.exports = {
  getUserChatList: async (req, res) => {
    /*
      userId로 유저가 참여중인 게더링 id 들을 
      몽구스chat 스키마에서 최근 메시지1개를 현재 날짜와 비교 (오늘: 12:12, 어제: 어제, 그 이후는 날짜로 보내주기)
     */
    const { userId } = res.locals;
    try {
      const gatheringListOfUser = await findGatheringOfUser({ userId }, ["userId", "id"]);
      const gatheringValidList = await Promise.all(
        gatheringListOfUser.map(async (el) => {
          return await el.getGathering({ where: { done: 0 }, attributes: ["id"] });
        })
      );
      if (!gatheringValidList[0]) {
        return res.status(404).json({ message: "There's no gathering participating" });
      }
      const gatheringIdList = gatheringValidList.map((el) => el?.id);
      // 몽구스
      const chatsList = await mongooseChatModel.find(
        { _id: gatheringIdList },
        { chatLog: { $slice: -1 }, chatInfo: 1, creatorId: 1 }
      );
      const chatsListToSend = await Promise.all(
        chatsList.map(async (el) => {
          const { chatLog: recentChat, _id: gatheringId, chatInfo, creatorId } = el;
          const date = recentChat[0]?.date;
          if (!date) {
            recentChat[0] = { userId: null, message: null, date: null };
            return { gatheringId, chatInfo, creatorId, recentChat };
          }
          const { userId: recentUserId } = recentChat[0];
          const userInfo = await userFindOne({ id: recentUserId });
          const userNickname = userInfo.dataValues.nickname;
          recentChat[0].user = userNickname;
          delete recentChat[0].userId;
          const currentDay = getCurrentTime().split(" ")[0];
          const [day, time] = date.split(" ");
          const oneDayToMillisecond = 86400000;
          if (currentDay === day) {
            recentChat[0].date = time;
          } else if (new Date(currentDay) - new Date(day) === oneDayToMillisecond) {
            recentChat[0].date = "어제";
          } else {
            recentChat[0].date = day;
          }
          return { gatheringId, chatInfo, creatorId, recentChat };
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
      const currentDay = +new Date(getCurrentTime());
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
      const chatInfo = await mongooseChatModel.findOne({ _id: gatheringId });
      chatInfo.chatLog = chatInfo.chatLog.map((el) => {
        const userInfo = participatingUserList.filter((userInfo) => userInfo.id === el.userId);
        delete el.userId;
        return { ...el, ...userInfo[0] };
      });
      res.status(200).json({ userList: participatingUserList, chatInfo });
    } catch (err) {
      DBERROR(res, err);
    }
  },
};
