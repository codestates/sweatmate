const { findAllGathering } = require("./functions/sequelize");
const { createValidObject } = require("./functions/utility");
module.exports = {
  getGatheringList: async (req, res) => {
    const { userId, done } = res.locals.gathering; //userId가 있냐 없냐에 따라서 분기됨
    /* 
    sportName, areaName, time, date, totalNum !== undefined 게더링 조건 검색
      userId, done !== undefined 유저의 게더링 목록 done 여부에 따라서 진행, 완료 조건 나누기
    */
    const queries = res.locals.gathering;
    console.log(queries);
    const searchCondition = createValidObject(queries);
    if (userId) {
      res.status(200).send("이곳은 유저의 게더링 일정");
    } else {
      const gatheringList = await findAllGathering(searchCondition);
      res.status(200).json(gatheringList);
    }
  },
};
