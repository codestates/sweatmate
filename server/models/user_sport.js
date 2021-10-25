const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_sport extends Model {
    static associate(models) {
      models.User_sport.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
        targetKey: "id",
        onDelete: "CASCADE",
      });
      models.User_sport.belongsTo(models.Sport, {
        foreignKey: { name: "sportId", allowNull: false },
        targetKey: "id",
        onDelete: "CASCADE",
      });
    }
  }
  user_sport.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "user",
            schema: "",
          },
          key: "id",
        },
        allowNull: false,
      },
      sportId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "sport",
            schema: "",
          },
          key: "id",
        },
        allowNull: false,
      },
      skill: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "User_sport",
      tableName: "user_sport",
      timestamps: false,
      underscored: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return user_sport;
};
