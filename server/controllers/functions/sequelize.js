const { User, Gathering, Sport } = require("../../models");

module.exports = {
  userFindOne: (object) => {
    return User.findOne({ where: { ...object } });
  },
  createUser: (object) => {
    return User.create(object);
  },
};
