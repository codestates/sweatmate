const {
  findAllGathering,
  findGatheringOfUser,
  createGathering,
  gatheringFindOne,
  findOrCreateUser_gathering,
  User_gatheringFindOne,
  userFindOne,
} = require("./functions/sequelize");
const chatModel = require("../schemas/chat");
const noticeModel = require("../schemas/notification");
const {
  createValidObject,
  DBERROR,
  getCurrentTime,
  modifyGatheringFormat,
} = require("./functions/utility");
const mongoose = require("mongoose");

module.exports = {
  getGatheringList: async (req, res) => {
    const searchCondition = createValidObject(res.locals.gathering);
    const conditions = createValidObject(res.locals.conditions);
    try {
      const gatheringList = await findAllGathering({ ...searchCondition, done: 0 });
      return res.status(200).json({ conditions, gatherings: modifyGatheringFormat(gatheringList) });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  getGatheringOfUser: async (req, res) => {
    const url = req.url.split("/")[1];
    let done = 1;
    if (url === "upcoming") done = 0;
    const { userId } = res.locals;
    try {
      const user_gatheringsOfUser = await findGatheringOfUser({ userId }, ["id", "userId"]);
      const gatheringId = user_gatheringsOfUser.map((el) => el.gatheringId);
      const gatheringList = await findAllGathering({ id: gatheringId, done });
      return res.status(200).json({ gatherings: modifyGatheringFormat(gatheringList) });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  getRandomGathering: async (req, res) => {
    try {
      const gatheringList = await findAllGathering({ done: 0 });
      return res.status(200).json({ gatherings: modifyGatheringFormat(gatheringList) });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  createGathering: async (req, res) => {
    const { userId, setGatheringInfo, sportInfo } = res.locals;
    try {
      const createdGathering = await createGathering(setGatheringInfo, userId);
      const { id, creator, title, sportName, sportEmoji } = createdGathering[0];
      //mongoDB chat 세팅
      //TODO: 유저 관리 객체에 만들어진 게더링 추가 + 만든 유저의 상태도 0 으로 자동 추가
      const setChatInfo = { _id: id, chatInfo: { title, ...sportInfo }, creatorId: creator.id };
      req.app.get("realTime")[id] = { [creator.id]: 0 };
      await chatModel.create(setChatInfo);
      //mongoDB
      return res.status(200).json(modifyGatheringFormat(createdGathering)[0]);
    } catch (err) {
      DBERROR(res, err);
    }
  },
  endGathering: async (req, res) => {
    //호스트가 호출하는 Api입니다.
    const { userId } = res.locals;
    const { gatheringId } = req.params;
    try {
      const gatheringInfo = await gatheringFindOne({ id: gatheringId });
      if (gatheringInfo.dataValues.creatorId !== userId) {
        return res.status(403).json({ message: "You don't have permission." });
      }
      gatheringInfo.update({ done: 1 });
      const { title } = gatheringInfo.dataValues;
      //이벤트
      const realTime = req.app.get("realTime");
      const userIds = Object.keys(realTime[gatheringId]);
      const _id = mongoose.Types.ObjectId();
      const main = req.app.get("main");
      const chat = req.app.get("chat");
      const noticeInfo = {
        id: _id,
        gatheringId: gatheringId,
        type: "earlydone",
        url: null,
        target: null,
        title: title,
        message: `모임이 조기 종료되었습니다`,
      };
      noticeModel.createNotice(userIds, noticeInfo);
      main.to(gatheringId).emit("notice", noticeInfo);
      chat.to(gatheringId).emit("notice", noticeInfo);
      chat.in(gatheringId).disconnectSockets();
      delete realTime[gatheringId];
      //이벤트
      const endedGatheringInfo = await findAllGathering({ id: gatheringId });
      return res.status(200).json(modifyGatheringFormat(endedGatheringInfo)[0]);
    } catch (err) {
      DBERROR(res, err);
    }
  },
  joinGathering: async (req, res) => {
    //유저가 이미 있는 모임에 참가 신청을 하는 Api 입니다.
    const { userId } = res.locals;
    const { gatheringId } = req.params;
    try {
      const [_, result] = await findOrCreateUser_gathering({ userId, gatheringId });
      if (!result) {
        return res.status(400).json({ message: "already participating" });
      }
      const gatheringInfo = await gatheringFindOne({ id: gatheringId });
      const { totalNum, currentNum, done, date, title } = gatheringInfo;
      const gatheringSetDay = +new Date(date);
      const currentDay = +new Date(getCurrentTime().split(" ")[0]);
      if (totalNum <= currentNum || done === 1 || gatheringSetDay < currentDay) {
        // 게더링에 참여할 수 없는 조건입니다.
        return res.status(400).json({ message: "already full of people or ended gathering" });
      }
      // TODO: 유저가 게더링에 참여했다는 이벤트를 모든 참여자에게 알림 + 유저 관리 객체에 해당 유저 추가
      //이벤트
      const userInfo = await userFindOne({ id: userId });
      const { nickname } = userInfo.dataValues;
      const realTime = req.app.get("realTime");
      const userIds = Object.keys(realTime[gatheringId]);
      const _id = mongoose.Types.ObjectId();
      const main = req.app.get("main");
      const chat = req.app.get("chat");
      const noticeInfo = {
        id: _id,
        gatheringId: gatheringId,
        type: "join",
        url: `/chat/${gatheringId}`,
        target: userId,
        title: title,
        message: `${nickname}님이 모임에 참여했습니다`,
      };
      // 채팅 시스템 알람이 없기 때문에 채팅에 참여중인 사람도 같이 알람을 받아야 함
      noticeModel.createNotice(userIds, noticeInfo);
      main.to(gatheringId).emit("notice", noticeInfo);
      chat.to(gatheringId).emit("notice", noticeInfo);
      realTime[gatheringId][userId] = 0;
      //이벤트
      await gatheringInfo.update({ currentNum: currentNum + 1 });
      const joinedGatheringInfo = await findAllGathering({ id: gatheringId });
      return res.status(201).json(modifyGatheringFormat(joinedGatheringInfo)[0]);
    } catch (err) {
      DBERROR(res, err);
    }
  },
  leaveGathering: async (req, res) => {
    const { userId } = res.locals;
    const { gatheringId } = req.params;
    try {
      const User_gatheringInfo = await User_gatheringFindOne({ userId, gatheringId });
      if (!User_gatheringInfo) {
        return res.status(400).json({ message: "You are not in a state of participation." });
      }
      //TODO: 유저가 게더링을 떠났다는 이벤트를 모든 참여자에게 알림 + 유저 관리 객체에 해당 유저 제거
      const userInfo = await userFindOne({ id: userId });
      const { nickname } = userInfo.dataValues;
      const realTime = req.app.get("realTime");
      delete realTime[gatheringId][userId];
      const userIds = Object.keys(realTime[gatheringId]);
      const _id = mongoose.Types.ObjectId();
      const main = req.app.get("main");
      const chat = req.app.get("chat");
      const noticeInfo = {
        id: _id,
        gatheringId: gatheringId,
        type: "leave",
        url: `/chat/${gatheringId}`,
        target: userId,
        title: title,
        message: `${nickname}님이 모임을 떠났습니다.`,
      };
      // 채팅 시스템 알람이 없기 때문에 채팅에 참여중인 사람도 같이 알람을 받아야 함
      noticeModel.createNotice(userIds, noticeInfo);
      main.to(gatheringId).emit("notice", noticeInfo);
      chat.to(gatheringId).emit("notice", noticeInfo);
      //이벤트

      const gatheringInfo = await gatheringFindOne({ id: gatheringId });
      const { currentNum } = gatheringInfo;
      await User_gatheringInfo.destroy();
      gatheringInfo.update({ currentNum: currentNum - 1 });
      const leftGatheringInfo = await findAllGathering({ id: gatheringId });
      return res.status(200).json(modifyGatheringFormat(leftGatheringInfo)[0]);
    } catch (err) {
      DBERROR(res, err);
    }
  },
};
