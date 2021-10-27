const { User, Gathering, Sport, User_sport } = require("../../models");

module.exports = {
  userFindOne: async (object, attributes = []) => {
    return await User.findOne({
      where: { ...object },
      attributes: { exclude: [...attributes] },
    });
  },
  createUser: (object) => {
    return User.create(object);
  },
  findSportsOfUser: async (object, attributes = []) => {
    return await User_sport.findAll({
      where: { ...object },
      attributes: { exclude: [...attributes] },
    });
  },
  modifyUserSportList: async (object, sportList) => {
    await User_sport.destroy({ where: { ...object } });
    await User_sport.bulkCreate(sportList);
  },
};
