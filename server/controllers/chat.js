const mongooseChatModel = require("../schemas/chat");
const { findGatheringOfUser } = require("./functions/sequelize");
const { createValidObject, DBERROR, getCurrentTime } = require("./functions/utility");
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
      const chatsListToSend = chatsList.map((el) => {
        const { chatLog: recentChat, _id: gatheringId, chatInfo, creatorId } = el;
        console.log(recentChat);
        const date = recentChat[0]?.date;
        if (!date) {
          return { gatheringId, chatInfo, creatorId, recentChat };
        }
        const currentDay = getCurrentTime().split(" ")[0];
        const [day, time] = date.split(" ");
        const oneDayToMillisecond = 86400000;
        console.log(new Date(currentDay) - new Date(day));
        if (currentDay === day) {
          recentChat[0].date = time;
        } else if (new Date(currentDay) - new Date(day) === oneDayToMillisecond) {
          recentChat[0].date = "어제";
        } else {
          recentChat[0].date = day;
        }
        return { gatheringId, chatInfo, creatorId, recentChat };
      });
      res.status(200).json(chatsListToSend);
    } catch (err) {
      DBERROR(res, err);
    }
  },
  joinChatingRoom: (req, res) => {
    // 채팅 아이디로 gathering done필드를 확인 또는 현재 시간과 게더링 date비교후에 하루가 지났으면  진입 불가.
    // 채팅 로그들, 참여자 목록(id, image,nickname),  더링 정보(이모지,스포츠. 타이틀)
  },
};
