import { createApp } from "./app";
import { env } from "./config/env";
import { assertDatabaseConnection } from "./config/database";
// Pastikan model & asosiasi teregistrasi.
import "./models";

async function bootstrap() {
  try {
    await assertDatabaseConnection();
    console.log("✅ Koneksi database berhasil");
  } catch (err) {
    console.error("⚠️  Gagal konek database (server tetap jalan):", (err as Error).message);
  }

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`🚀 Pensil API berjalan di http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
}

bootstrap();
