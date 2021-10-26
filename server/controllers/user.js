const { userFindOne, findSportsOfUser } = require("./functions/sequelize");
const { clearCookie } = require("./functions/token");
module.exports = {
  getUerInfo: async (req, res) => {
    const { userId, type } = res.locals;
    if (userId !== req.params.userId) {
      return res.status(403).json({ message: "You don't have permission" });
    }
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
  removeUserInfo: async (req, res) => {
    const { userId, type } = res.locals;
    if (userId !== req.params.userId) {
      return res.status(403).json({ message: "User don't have permission" });
    }
    const userInfo = await userFindOne({ id: userId });
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    await userInfo.destroy();
    clearCookie(res, token);
    return res.status(200).json({ message: "User deleted" });
  },
};
