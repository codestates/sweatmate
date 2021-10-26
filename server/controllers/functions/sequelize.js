const { User, Gathering, Sport } = require("../../models");

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
};
