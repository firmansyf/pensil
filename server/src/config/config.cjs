// Konfigurasi untuk sequelize-cli (migrations & seeders).
// File ini sengaja CommonJS (.cjs) karena dibaca langsung oleh sequelize-cli.
require("dotenv").config();

const common = {
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "pensil",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  dialect: "postgres",
  // Kalau DATABASE_URL diisi, sequelize-cli akan memakainya.
  use_env_variable: process.env.DATABASE_URL ? "DATABASE_URL" : undefined,
};

module.exports = {
  development: { ...common, logging: console.log },
  test: { ...common, database: `${common.database}_test`, logging: false },
  production: {
    ...common,
    logging: false,
    dialectOptions: {
      ssl:
        process.env.DB_SSL === "true"
          ? { require: true, rejectUnauthorized: false }
          : undefined,
    },
  },
};
