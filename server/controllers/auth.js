const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const { userFindOne, createUser } = require("./functions/sequelize");
const { sendGmail } = require("./functions/mail");
const { DBERROR } = require("./functions/utility");
const { generateAccessToken, setCookie } = require("./functions/token");
const {
  bcrypt: { saltRounds },
} = require("../config");
const user = require("../models/user");
const emailForm = require("../views/emailFormat");

module.exports = {
  checkNickname: async (req, res) => {
    const { nickname } = req.params;
    try {
      const userInfo = await userFindOne({ nickname });
      if (!userInfo) return res.status(200).json({ message: "Valid nickname" });
      return res.status(409).json({ message: `${nickname} already exists` });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  checkEmail: async (req, res) => {
    const { email } = req.params;
    try {
      const userInfo = await userFindOne({ email });
      if (!userInfo) return res.status(200).json({ message: "Valid nickname" });
      const { type } = userInfo.dataValues;
      return res.status(409).json({ message: `${email} already exists`, type });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  signup: async (req, res) => {
    const { email, password, nickname } = req.body;
    console.log(req.body);
    const foundUserByNickname = await userFindOne({ nickname });
    if (foundUserByNickname) return res.status(409).json({ message: `${nickname} already exists` });

    const foundUserByEmail = await userFindOne({ email });
    if (foundUserByEmail) {
      const { type } = foundUserByEmail.dataValues;
      return res.status(409).json({ message: `${email} already exists`, type });
    }

    const hashed = await bcrypt.hash(password, saltRounds);
    const authKey = Math.random().toString(36).slice(2);

    try {
      const createdUserInfo = await createUser({
        id: uuid(),
        nickname,
        email,
        password: hashed,
        authKey,
      });

      setTimeout(async () => {
        const userInfo = await userFindOne({ authKey });
        if (!userInfo.dataValues.authStatus) {
          await userInfo.destroy();
          console.log(abc.dataValues, "유저 정보가 삭제되었습니다.");
        }
      }, 60 * 60 * 1000);

      sendGmail({
        toEmail: email,
        subject: "안녕하세요 Sweatmate입니다.",
        html: emailForm(authKey),
      });

      return res.status(201).json({ message: "1시간 이내에 이메일 인증을 진행해주세요" });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  certifyEmail: async (req, res) => {
    const { authKey } = req.params;
    const userInfo = await userFindOne({ authKey });
    if (!userInfo) return res.status(400).send("인증 시간이 초과되었습니다.");
    userInfo.update({ authStatus: 1, authKey: null });
    return res.redirect(302, `${process.env.CLIENT_URL}`);
  },
  signout: (req, res) => {
    clearCookie(res);
    res.status(205).json({ message: "Signed out" });
  },
};
