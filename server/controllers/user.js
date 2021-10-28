const { userFindOne, findSportsOfUser, modifyUserSportList } = require("./functions/sequelize");
const { clearCookie } = require("./functions/token");
const { DBERROR, deleteImageinTable } = require("./functions/utility");
const areaList = require("../resource/areaList");
const sportsList = require("../resource/sportList");

module.exports = {
  getUerInfo: async (req, res) => {
    const { userId } = res.locals;
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
      const areaName = areaInfo?.dataValues.areaName ?? null;
      delete userInfo.dataValues.areaId;
      return res.status(200).json({ ...userInfo.dataValues, areaName, sports });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  modifyUserInfo: async function (req, res) {
    const { userId } = res.locals;
    try {
      const { nickname, areaName, age, sports, gender } = req.body;
      const userInfo = await userFindOne({ id: userId });
      let location;
      if (req.file) {
        location = req.file.location;
        const { image } = userInfo.dataValues;
        if (image) {
          deleteImageinTable(image);
        }
      }
      const areaId = areaList.filter((el) => el.areaName === areaName)[0].id;
      const setSportsByUser = JSON.parse(sports); // [{sportName:축구, skill: 1}, {sportName:야구, skill: 3} ...]
      const getUserSportsList = setSportsByUser.map((userSport) => {
        const sportInfo = sportsList.filter((sportList) => {
          return userSport.sportName === sportList.sportName;
        })[0];
        return { sportId: sportInfo.id, userId, skill: userSport.skill };
      });
      await userInfo.update({ nickname, age, areaId, image: location, gender });
      await modifyUserSportList({ userId }, getUserSportsList);
      module.exports.getUerInfo(req, res);
    } catch (err) {
      DBERROR(res, err);
    }
  },
  removeUserInfo: async (req, res) => {
    const { userId } = res.locals;
    try {
      const userInfo = await userFindOne({ id: userId });
      if (!userInfo) {
        return res.status(404).json({ message: "User not found" });
      }
      await userInfo.destroy();
      clearCookie(res, token);
      return res.status(200).json({ message: "User deleted", data: { userId } });
    } catch (err) {
      DBERROR(res, err);
    }
  },
};
