const {
  findAllGathering,
  findGatheringOfUser,
  createGathering,
  gatheringFindOne,
  findOrCreateUser_gathering,
  User_gatheringFindOne,
} = require("./functions/sequelize");
const mongooseChatModel = require("../schemas/chat");
const {
  createValidObject,
  DBERROR,
  getCurrentTime,
  modifyGatheringFormat,
} = require("./functions/utility");

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
      //mongoDB chat 세팅
      const { id, creator, title } = createdGathering[0];
      const setChatInfo = { _id: id, chatInfo: { title, ...sportInfo }, creatorId: creator.id };
      await mongooseChatModel.create(setChatInfo);
      //mongoDB
      return res.status(200).json(createdGathering[0]);
    } catch (err) {
      DBERROR(res, err);
    }
  },
  endGathering: async (req, res) => {
    //TODO: 조기 종료 되거나 노드 스케쥴러에 의해 종료가 되면 채팅창진입불가(채팅창 로그는 볼 수 있게 하느냐 마느냐 나중에 결정)
    //호스트가 호출하는 Api입니다.
    const { userId } = res.locals;
    const { gatheringId } = req.params;
    try {
      const gatheringInfo = await gatheringFindOne({ id: gatheringId });
      if (gatheringInfo.dataValues.creatorId !== userId) {
        return res.status(403).json({ message: "You don't have permission." });
      }
      gatheringInfo.update({ done: 1 });
      //TODO: 게더링이 조기종료 했다고 모든 참여자에게 알림 또는 노드스케줄러에 의해 종료되었음을 알림
      const endedGatheringInfo = await findAllGathering({ id: gatheringId });
      return res.status(200).json(endedGatheringInfo[0]);
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
      const { totalNum, currentNum, done, date } = gatheringInfo;
      const gatheringSetDay = +new Date(date);
      const currentDay = +new Date(getCurrentTime().split(" ")[0]);
      if (totalNum <= currentNum || done === 1 || gatheringSetDay < currentDay) {
        // 게더링에 참여할 수 없는 조건입니다.
        return res.status(400).json({ message: "already full of people or ended gathering" });
      }
      // TODO: 유저가 게더링에 참여했다는 이벤트를 모든 참여자에게 알림
      await gatheringInfo.update({ currentNum: currentNum + 1 });
      const joinedGatheringInfo = await findAllGathering({ id: gatheringId });
      return res.status(201).json(joinedGatheringInfo[0]);
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
      //TODO: 유저가 게더링을 떠났다는 이벤트를 모든 참여자에게 알림
      const gatheringInfo = await gatheringFindOne({ id: gatheringId });
      const { currentNum } = gatheringInfo;
      await User_gatheringInfo.destroy();
      gatheringInfo.update({ currentNum: currentNum - 1 });
      const leftGatheringInfo = await findAllGathering({ id: gatheringId });
      return res.status(200).json(leftGatheringInfo[0]);
    } catch (err) {
      DBERROR(res, err);
    }
  },
};
