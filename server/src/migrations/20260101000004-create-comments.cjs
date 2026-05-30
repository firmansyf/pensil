"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comments", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      body: { type: Sequelize.TEXT, allowNull: false },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "posts", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("comments");
  },
};
