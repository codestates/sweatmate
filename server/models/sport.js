"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sport extends Model {
    static associate(models) {
      models.Sport.hasMany(models.User_sport, {
        foreignKey: "sportId",
        targetKey: "id",
      });
      models.Sport.hasMany(models.Gathering, {
        foreignKey: "sportId",
        targetKey: "id",
      });
    }
  }
  sport.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sportEmoji: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sportName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Sport",
      tableName: "sport",
      timestamps: false,
      underscored: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return sport;
};
