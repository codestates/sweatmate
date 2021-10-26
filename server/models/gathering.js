const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class gathering extends Model {
    static associate(models) {
      models.Gathering.belongsTo(models.Sport, {
        foreignKey: { name: "sportId", allowNull: true },
        targetKey: "id",
        onDelete: "SET NULL",
      });
      models.Gathering.belongsTo(models.Area, {
        foreignKey: { name: "areaId", allowNull: true },
        targetKey: "id",
        onDelete: "SET NULL",
      });
      models.Gathering.belongsTo(models.User, {
        foreignKey: { name: "creatorId", allowNull: false },
        targetKey: "id",
        onDelete: "CASCADE",
      });
      models.Gathering.hasMany(models.User_gathering, {
        foreignKey: "gatheringId",
        targetKey: "id",
      });
    }
  }
  gathering.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      placeName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      latitude: {
        type: Sequelize.DECIMAL(13, 10),
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(13, 10),
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timeDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalNum: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currentNum: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      done: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("NOW()"),
      },
    },
    {
      sequelize,
      modelName: "Gathering",
      tableName: "gathering",
      timestamps: false,
      underscored: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  return gathering;
};
