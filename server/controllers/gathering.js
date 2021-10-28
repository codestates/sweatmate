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
  TranslateFromSportNameToSportName,
  TranslateFromAreaNameToAreaName,
} = require("./functions/utility");
const { verifyAccessToken } = require("./functions/token");

module.exports = {
  getGatheringList: async (req, res) => {
    const queries = res.locals.gathering;
    const searchCondition = createValidObject(queries);
    try {
      const gatheringList = await findAllGathering(searchCondition);
      res.status(200).json(gatheringList);
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
      res.status(200).json(gatheringList);
    } catch (err) {
      DBERROR(res, err);
    }
  },
  getRandomGathering: async (req, res) => {
    const accessToken = req.cookies.jwt;
    const searchCondition = { sportId: creatRandomNumber(1, 4), areaId: creatRandomNumber(1, 1) }; //TODO: 랜덤검색 시 충분한 데이터가 없음
    try {
      if (accessToken) {
        const { id } = verifyAccessToken(accessToken);
        const userInfo = await userFindOne({ id });
        searchCondition.areaId = userInfo.dataValues.areaId ?? searchCondition.areaId;
        const userSportList = await userInfo.getUser_sports({ attributes: ["sportId"] });
        if (userSportList.length !== 0) {
          searchCondition.sportId = userSportList.map((el) => el.sportId);
        }
      }
      const gatheringList = await findAllGathering(searchCondition);
      res.status(200).json(gatheringList);
    } catch (err) {
      DBERROR(res, err);
    }
  },
  createGathering: async (req, res) => {
    const { userId } = res.locals;
    const sportId = TranslateFromSportNameToSportName(req.body.sportName);
    const areaId = TranslateFromAreaNameToAreaName(req.body.areaName);
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
