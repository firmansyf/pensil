import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "../config/database";

export type UserRole = "admin" | "author" | "reader";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: CreationOptional<UserRole>;
  declare bio: CreationOptional<string | null>;
  declare avatarUrl: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  /** Bandingkan password plaintext dengan hash tersimpan. */
  async comparePassword(candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.password);
  }

  /** Bentuk aman untuk dikirim ke client (tanpa password). */
  toSafeJSON() {
    const { password: _password, ...rest } = this.get();
    return rest;
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("admin", "author", "reader"),
      allowNull: false,
      defaultValue: "reader",
    },
    bio: { type: DataTypes.TEXT, allowNull: true },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    defaultScope: { attributes: { exclude: ["password"] } },
    scopes: { withPassword: { attributes: { include: ["password"] } } },
    hooks: {
      async beforeSave(user: User) {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);
