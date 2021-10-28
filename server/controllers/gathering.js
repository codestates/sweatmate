const e = require("express");
const {
  findAllGathering,
  findGatheringOfUser,
  userFindOne,
  createGathering,
} = require("./functions/sequelize");
const {
  createValidObject,
  creatRandomNumber,
  DBERROR,
  TranslateFromSportNameToSportInfo,
  TranslateFromAreaNameToAreaInfo,
} = require("./functions/utility");
const { verifyAccessToken } = require("./functions/token");

module.exports = {
  getGatheringList: async (req, res) => {
    const searchCondition = createValidObject(res.locals.gathering);
    const conditions = createValidObject(res.locals.conditions);
    try {
      const gatheringList = await findAllGathering(searchCondition);
      res.status(200).json({ conditions, gathering: gatheringList });
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
      res.status(200).json({ gathering: gatheringList });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  getRandomGathering: async (req, res) => {
    try {
      const gatheringList = await findAllGathering({ done: 0 });
      res.status(200).json({ gatherings: gatheringList });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  createGathering: async (req, res) => {
    const { userId } = res.locals;
    const sportId = TranslateFromSportNameToSportInfo(req.body.sportName).id;
    const areaId = TranslateFromAreaNameToAreaInfo(req.body.areaName).id;
    delete req.body.sportName;
    delete req.body.areaName;
    const setGatheringInfo = { ...req.body, currentNum: 1, creatorId: userId, sportId, areaId };
    try {
      const createdGathering = await createGathering(setGatheringInfo);
      delete createdGathering.dataValues.createdAt;
      //TODO: 게더링 생성시 응답 데이터 미정.
      res.status(200).json(createdGathering);
    } catch (err) {
      DBERROR(res, err);
    }
  },
};
