const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const { userFindOne, createUser } = require("./functions/sequelize");
const { sendGmail } = require("./functions/mail");
const { DBERROR } = require("./functions/utility");
const { generateAccessToken, setCookie, clearCookie } = require("./functions/token");
const {
  bcrypt: { saltRounds },
} = require("../config");
const emailForm = require("../views/emailFormat");

module.exports = {
  validNickname: async (req, res) => {
    res.status(200).json({ message: "Valid nickname" });
  },
  validEmail: async (req, res) => {
    return res.status(200).json({ message: "Valid nickname" });
  },
  signup: async (req, res) => {
    const { email, password, nickname } = req.body;

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
          console.log(userInfo.dataValues, "유저 정보가 삭제되었습니다.");
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
    try {
      const userInfo = await userFindOne({ authKey });
      if (!userInfo) return res.status(400).send("인증 시간이 초과되었습니다.");
      userInfo.update({ authStatus: 1, authKey: null });
      return res.redirect(302, `${process.env.CLIENT_URL}`);
    } catch (err) {
      DBERROR(res, err);
    }
    //TODO: 클라이언트와 싱크 맞추기
  },
  signin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const foundUserByEmail = await userFindOne({ email });
      if (!foundUserByEmail) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      if (!foundUserByEmail.dataValues.authStatus) {
        return res.status(401).json({ message: "Need to verify your email first" });
      }
      const isValidPassword = await bcrypt.compare(password, foundUserByEmail.dataValues.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const token = generateAccessToken(
        foundUserByEmail.dataValues.id,
        foundUserByEmail.dataValues.type
      );
      setCookie(res, token);
      const { id, image, nickname } = foundUserByEmail.dataValues;
      return res.status(200).json({ id, image, nickname });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  me: async (req, res) => {
    const { userId, type } = res.locals;
    try {
      const userInfo = await userFindOne({ id: userId });
      const { id, image, nickname } = userInfo;
      res.status(200).json({ id, image, nickname });
    } catch (err) {
      DBERROR(res, err);
    }
  },
  signout: (req, res) => {
    clearCookie(res);
    res.status(205).json({ message: "Signed out" });
  },
};
