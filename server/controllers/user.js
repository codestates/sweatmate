const {
  userFindOne,
  findSportsOfUser,
  modifyUserSportList,
  decrementGatheringsOfUser,
} = require("./functions/sequelize");
const { clearCookie } = require("./functions/token");
const { DBERROR, deleteImageinTable, dropUser } = require("./functions/utility");
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
      dropUser(userId, req);
      deleteImageinTable(userInfo.dataValues.image);
      // 회원 탈퇴에 의해 종료된 게더링에 참여중인 유저들에게 탈퇴에 의한 게더링이 종료 되었음을 이벤트 알림으로 줘야함
      // 몽구스의 게더링 또한 같이 삭제되어야함
      // 유저관리 객체에 해당하는 유저 아이디들에게 알림을 줘야함
      // 그리고 유저관리객체에 해당 게더링들을 삭제함

      await userInfo.destroy();
      clearCookie(res, token);
      return res.status(200).json({ message: "User deleted", data: { userId } });
    } catch (err) {
      DBERROR(res, err);
    }
  },
};
