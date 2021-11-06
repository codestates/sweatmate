const { sign, verify } = require("jsonwebtoken");
const {
  jwt: { secretKey, expiresInSec },
} = require("../../config");

module.exports = {
  generateAccessToken: (id, type) => {
    try {
      const token = sign({ id, type }, secretKey, {
        expiresIn: expiresInSec,
      });
      return token;
    } catch (err) {
      return null;
    }
  },

  verifyAccessToken: (token) => {
    try {
      const decoded = verify(token, secretKey);
      return decoded;
    } catch (err) {
      return null;
    }
  },

  setCookie: (res, token) => {
    res.cookie("jwt", token, {
      secure: true,
      sameSite: "none",
      httpOnly: true,
    });
  },

  clearCookie: (res) => {
    res.clearCookie("jwt", {
      secure: true,
      sameSite: "none",
      httpOnly: true,
    });
  },
};
