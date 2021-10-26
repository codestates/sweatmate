const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_gathering extends Model {
    static associate(models) {
      models.User_gathering.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
        targetKey: "id",
        onDelete: "CASCADE",
      });
      models.User_gathering.belongsTo(models.Sport, {
        foreignKey: { name: "gatheringId", allowNull: false },
        targetKey: "id",
        onDelete: "CASCADE",
      });
    }
  }
  user_gathering.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "User_gathering",
      tableName: "user_gathering",
      timestamps: false,
      underscored: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return user_gathering;
};
