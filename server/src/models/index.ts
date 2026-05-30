import { sequelize } from "../config/database";
import { User } from "./user.model";
import { Category } from "./category.model";
import { Post } from "./post.model";
import { Comment } from "./comment.model";

// ─── Asosiasi ────────────────────────────────────────────
User.hasMany(Post, { foreignKey: "authorId", as: "posts" });
Post.belongsTo(User, { foreignKey: "authorId", as: "author" });

Category.hasMany(Post, { foreignKey: "categoryId", as: "posts" });
Post.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

Post.hasMany(Comment, { foreignKey: "postId", as: "comments", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

User.hasMany(Comment, { foreignKey: "authorId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "authorId", as: "author" });

export { sequelize, User, Category, Post, Comment };

export const db = { sequelize, User, Category, Post, Comment };
export type Db = typeof db;
