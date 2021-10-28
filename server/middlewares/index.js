const { verifyAccessToken, clearCookie } = require("../controllers/functions/token");
const { userFindOne } = require("../controllers/functions/sequelize");
const { DBERROR, createValidObject } = require("../controllers/functions/utility");
const AUTH_ERROR = { message: "Authentication Error" };
const areaList = require("../resource/areaList");
const sportsList = require("../resource/sportList");

module.exports = {
  isAuth: async (req, res, next) => {
    const accessToken = req.cookies.jwt;
    if (!accessToken) {
      return res.status(403).json(AUTH_ERROR);
    }

    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
      clearCookie(res);
      return res.status(403).json(AUTH_ERROR);
    }
    const foundUser = await userFindOne({ id: decoded.id });
    if (!foundUser) {
      clearCookie(res);
      return res.status(403).json(AUTH_ERROR);
    }
    res.locals.userId = foundUser.dataValues.id;
    res.locals.type = foundUser.dataValues.type;
    res.locals.token = accessToken;
    return next();
  },
  checkNickname: async (req, res, next) => {
    const nickname = req.params.nickname ?? req.body.nickname;
    try {
      const userInfo = await userFindOne({ nickname });
      if (userInfo) return res.status(409).json({ message: `${nickname} already exists` });
      return next();
    } catch (err) {
      DBERROR(res, err);
    }
  },
  checkEmail: async (req, res, next) => {
    const email = req.params.email ?? req.body.email;
    try {
      const userInfo = await userFindOne({ email });
      if (userInfo) {
        const { type } = userInfo.dataValues;
        return res.status(409).json({ message: `${email} already exists`, type });
      }
      return next();
    } catch (err) {
      DBERROR(res, err);
    }
  },
  checkPermission: async (req, res, next) => {
    if (res.locals.userId !== req.params.userId) {
      return res.status(403).json({ message: "You don't have permission" });
    }
    next();
  },
  createConditionsForSearching: (req, res, next) => {
    const { sportName, areaName, time, date, totalNum } = req.query;
    const areaId = areaList.filter((el) => el.areaName === areaName)[0]?.id;
    const sportId = sportsList.filter((el) => el.sportName === sportName)[0]?.id;
    res.locals.gathering = {
      time,
      date,
      totalNum,
      areaId,
      sportId,
    };
    next();
  },
};
