const { userFindOne, findSportsOfUser } = require("./functions/sequelize");

module.exports = {
  getUerInfo: async (req, res) => {
    const { userId, type } = res.locals;
    console.log(userId, type);
    try {
      const userInfo = await userFindOne({ id: userId }, [
        "id",
        "password",
        "authKey",
        "authStatus",
        "createdAt",
        "updatedAt",
      ]);
      const areaInfo = await userInfo.getArea({ attributes: ["areaName"] });
      const user_sportInfos = await findSportsOfUser({ userId }, ["id", "userId"]);
      const sportsPromise = user_sportInfos.map(async (el) => {
        const { skill } = el.dataValues;
        const sportInfo = await el.getSport({ attributes: { exclude: ["id"] } });
        const { sportEmoji, sportName, sportEngName } = sportInfo.dataValues;
        return { skill, sportEmoji, sportName, sportEngName };
      });
      const sports = await Promise.all(sportsPromise);
      const { areaName } = areaInfo.dataValues;
      delete userInfo.dataValues.areaId;
      res.status(200).json({ ...userInfo.dataValues, areaName, sports });
    } catch (err) {
      console.log(err);
      res.status(500).send("에러났어요");
    }
  },
};
