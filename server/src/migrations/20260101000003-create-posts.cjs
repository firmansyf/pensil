"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("posts", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      excerpt: { type: Sequelize.STRING(500), allowNull: true },
      content: { type: Sequelize.TEXT, allowNull: false },
      coverImage: { type: Sequelize.STRING, allowNull: true },
      status: {
        type: Sequelize.ENUM("draft", "published"),
        allowNull: false,
        defaultValue: "draft",
      },
      publishedAt: { type: Sequelize.DATE, allowNull: true },
      viewCount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "categories", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex("posts", ["status"]);
    await queryInterface.addIndex("posts", ["publishedAt"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("posts");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_posts_status";');
  },
};
