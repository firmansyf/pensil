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
import type { Post } from "./post.model";

export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  declare id: CreationOptional<number>;
  declare body: string;
  declare authorId: ForeignKey<User["id"]>;
  declare postId: ForeignKey<Post["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare author?: NonAttribute<User>;
}

Comment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    body: { type: DataTypes.TEXT, allowNull: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    postId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comments",
  },
);
