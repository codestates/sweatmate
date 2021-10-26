const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const { userFindOne, createUser } = require("./functions/sequelize");
const { DBERROR } = require("./functions/utility");
const { saltRounds } = require("../config");
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

    const foundUserByNickname = await userFindOne({ nickname });
    if (foundUserByNickname) return res.status(409).json({ message: `${nickname} already exists` });

    const foundUserByEmail = await userFindOne({ email });
    if (foundUserByEmail) {
      const { type } = foundUserByEmail.dataValues;
      return res.status(409).json({ message: `${email} already exists`, type });
    }

    const hashed = await bcrypt.hash(password, saltRounds);

    try {
      const userInfo = await createUser({
        id: uuid(),
        nickname,
        email,
        password: hashed,
      });
      const { id, image } = userInfo.dataValues;
      const token = generateAccessToken(id);
      setCookie(res, token);
      return res.status(201).json({ id, image, nickname });
    } catch (err) {
      DBERROR(res, err);
    }
  },
};
