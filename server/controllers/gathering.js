const e = require("express");
const { findAllGathering, findGatheringOfUser } = require("./functions/sequelize");
const { createValidObject } = require("./functions/utility");
module.exports = {
  getGatheringList: async (req, res) => {
    /* 
    sportName, areaName, time, date, totalNum !== undefined 게더링 조건 검색
      userId, done !== undefined 유저의 게더링 목록 done 여부에 따라서 진행, 완료 조건 나누기
    */
    const queries = res.locals.gathering;
    const searchCondition = createValidObject(queries);
    const gatheringList = await findAllGathering(searchCondition);
    res.status(200).json(gatheringList);
  },
  getGatheringOfUser: async (req, res) => {
    const url = req.url.split("/")[1];
    let done = 1;
    if (url === "upcoming") done = 0;
    const { userId } = res.locals;
    const user_gatheringsOfUser = await findGatheringOfUser({ userId }, ["id", "userId"]);
    const gatheringId = user_gatheringsOfUser.map((el) => el.gatheringId);
    const gatheringList = await findAllGathering({ id: gatheringId, done });
    res.status(200).json(gatheringList);
  },
};
