"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_gathering", {
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
      gatheringId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "gathering",
            schema: "",
          },
          key: "id",
        },
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_gathering");
  },
};
