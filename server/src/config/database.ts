import { Sequelize } from "sequelize";
import { env } from "./env";

const logging = env.NODE_ENV === "development" ? console.log : false;

export const sequelize = env.DATABASE_URL
  ? new Sequelize(env.DATABASE_URL, { dialect: "postgres", logging })
  : new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
      host: env.DB_HOST,
      port: env.DB_PORT,
      dialect: "postgres",
      logging,
    });

export async function assertDatabaseConnection(): Promise<void> {
  await sequelize.authenticate();
}
