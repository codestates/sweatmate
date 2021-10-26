const { userFindOne } = require("./functions/sequelize");

module.exports = {
  getUerInfo: async (req, res) => {
    const { userId, type } = res.locals;
    console.log(userId, type);
    const userInfo = await userFindOne({ id: userId }, ["id", "password"]);
    // TODO: 유저인포 모델없이 조인이 되나 ?
  },
};
