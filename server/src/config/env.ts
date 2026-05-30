import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().default("http://localhost:3000"),

  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().default("pensil"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres"),
  DATABASE_URL: z.string().optional(),

  JWT_SECRET: z.string().min(8, "JWT_SECRET minimal 8 karakter"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Konfigurasi environment tidak valid:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
