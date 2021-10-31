const { userFindOne, findSportsOfUser, modifyUserSportList } = require("./functions/sequelize");
const { Gathering } = require("../models");
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
    const location = req.file?.location; // multer가 저장한 사진의 s3 url이 저장되어있음
    try {
      const { nickname, areaName, age, sports, gender } = req.body;
      const userInfo = await userFindOne({ id: userId });
      const { image } = userInfo.dataValues;
      const areaId = areaList.filter((el) => el.areaName === areaName)[0].id;
      await userInfo.update({ nickname, age, areaId, image: location, gender }); // 닉네임이 중복되어 오류가 나면 s3에 저장한 사진 삭제해줘야 함
      if (location && image) {
        console.log("기존 유저 image가 s3에서 삭제됩니다.");
        deleteImageinTable(image);
      }
      const getUserSportsList = JSON.parse(sports).map((userSport) => {
        const sportInfo = sportsList.filter((sportList) => {
          return userSport.sportName === sportList.sportName;
        })[0];
        return { sportId: sportInfo.id, userId, skill: userSport.skill };
      });
      await modifyUserSportList({ userId }, getUserSportsList);
      module.exports.getUerInfo(req, res);
    } catch (err) {
      console.log(err);
      deleteImageinTable(location); // 유저 입데이트 과정에서 오류가 났으므로 유저가 업로드한 s3에 저장된 사진을 삭제함
      return res.status(400).json({ message: "Nickname already exists" });
    }
  },
  removeUserInfo: async (req, res) => {
    const { userId, token } = res.locals;
    try {
      const userInfo = await userFindOne({ id: userId });
      if (!userInfo) {
        return res.status(404).json({ message: "User not found" });
      }
      const User_gatheringlist = await userInfo.getUser_gatherings({
        include: { model: Gathering },
      });
      await Promise.all(
        User_gatheringlist.map(async (el) => await el.Gathering.decrement("currentNum", { by: 1 }))
      );
      await userInfo.destroy();
      //mongoDB에서도 게더링 정보와 유저 정보 삭제해야 함 +  회원탈퇴 시에 게더링정보를 남기느냐 아니냐 상의해야함 현재는 유저삭제시 관련 정보 전부 삭제
      clearCookie(res, token);
      return res.status(200).json({ message: "User deleted", data: { userId } });
    } catch (err) {
      DBERROR(res, err);
    }
  },
};
