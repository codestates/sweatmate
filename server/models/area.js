const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class area extends Model {
    static associate(models) {
      models.Area.hasMany(models.User, {
        foreignKey: "areaId",
        targetKey: "id",
      });
      models.User.hasMany(models.Gathering, {
        foreignKey: "areaId",
        targetKey: "id",
      });
    }
  }
  area.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      areaName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Area",
      tableName: "area",
      timestamps: false,
      underscored: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return area;
};
