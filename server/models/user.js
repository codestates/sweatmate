const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.User.belongsTo(models.Area, {
        foreignKey: { name: "areaId", allowNull: true },
        targetKey: "id",
        onDelete: "SET NULL",
      });
      models.User.hasMany(models.User_sport, {
        foreignKey: "userId",
        targetKey: "id",
      });
      models.User.hasMany(models.Gathering, {
        foreignKey: "creatorId",
        targetKey: "id",
      });
      models.User.hasMany(models.User_gathering, {
        foreignKey: "userId",
        targetKey: "id",
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nickname: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "local",
      },
      authKey: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      authStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "user",
      timestamps: true,
      underscored: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return User;
};
