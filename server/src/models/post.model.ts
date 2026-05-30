import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type ForeignKey,
  type NonAttribute,
} from "sequelize";
import { sequelize } from "../config/database";
import type { User } from "./user.model";
import type { Category } from "./category.model";

export type PostStatus = "draft" | "published";

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare slug: string;
  declare excerpt: CreationOptional<string | null>;
  declare content: string;
  declare coverImage: CreationOptional<string | null>;
  declare status: CreationOptional<PostStatus>;
  declare publishedAt: CreationOptional<Date | null>;
  declare viewCount: CreationOptional<number>;

  declare authorId: ForeignKey<User["id"]>;
  declare categoryId: CreationOptional<ForeignKey<Category["id"]> | null>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Asosiasi yang di-eager-load (bukan kolom).
  declare author?: NonAttribute<User>;
  declare category?: NonAttribute<Category>;
}

Post.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    excerpt: { type: DataTypes.STRING(500), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    coverImage: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "draft",
    },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    viewCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    categoryId: { type: DataTypes.INTEGER, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
    indexes: [{ fields: ["status"] }, { fields: ["publishedAt"] }],
  },
);
