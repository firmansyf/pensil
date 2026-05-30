"use strict";

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const hash = (pw) => bcrypt.hashSync(pw, 10);

    // ─── Users ───
    await queryInterface.bulkInsert("users", [
      {
        name: "Admin Pensil",
        email: "admin@pensil.dev",
        password: hash("admin123"),
        role: "admin",
        bio: "Pengelola Pensil.",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Penulis Random",
        email: "author@pensil.dev",
        password: hash("author123"),
        role: "author",
        bio: "Suka menulis apa saja.",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // ─── Categories ───
    await queryInterface.bulkInsert("categories", [
      { name: "Teknologi", slug: "teknologi", description: "Hal-hal seputar tech.", createdAt: now, updatedAt: now },
      { name: "Kehidupan", slug: "kehidupan", description: "Cerita sehari-hari.", createdAt: now, updatedAt: now },
      { name: "Random", slug: "random", description: "Apa saja yang random.", createdAt: now, updatedAt: now },
    ]);

    // Ambil id yang baru dibuat (urutan tidak dijamin, jadi query ulang).
    const [users] = await queryInterface.sequelize.query(
      `SELECT id, role FROM users ORDER BY id ASC;`,
    );
    const [categories] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM categories ORDER BY id ASC;`,
    );
    const author = users.find((u) => u.role === "author") || users[0];
    const catBy = (slug) => categories.find((c) => c.slug === slug)?.id ?? null;

    // ─── Posts ───
    const posts = [
      {
        title: "Selamat Datang di Pensil",
        slug: "selamat-datang-di-pensil",
        excerpt: "Pensil adalah tempat kumpulan blog random dari siapa saja.",
        content:
          "Pensil lahir dari ide sederhana: satu tempat untuk semua tulisan random. " +
          "Mulai dari catatan teknis, curhat tengah malam, sampai resep mie instan tingkat dewa.",
        category: "random",
        status: "published",
      },
      {
        title: "Kenapa Saya Suka Menulis Tanpa Tema",
        slug: "menulis-tanpa-tema",
        excerpt: "Kadang tulisan terbaik datang saat kita tidak memaksakan tema.",
        content:
          "Menulis tanpa tema itu membebaskan. Tidak ada outline, tidak ada tekanan. " +
          "Cukup tulis apa yang ada di kepala, dan biarkan kalimat menemukan jalannya sendiri.",
        category: "kehidupan",
        status: "published",
      },
      {
        title: "Tumpukan Teknologi Pensil",
        slug: "tumpukan-teknologi-pensil",
        excerpt: "Express, Sequelize, Postgres di belakang; Next.js + Tailwind di depan.",
        content:
          "Pensil dibangun sebagai monorepo. Backend memakai Express + Sequelize + Postgres, " +
          "frontend memakai Next.js dan Tailwind. Semua diketik dengan TypeScript.",
        category: "teknologi",
        status: "published",
      },
      {
        title: "Draf yang Belum Selesai",
        slug: "draf-belum-selesai",
        excerpt: "Sebuah draft contoh yang belum dipublikasikan.",
        content: "Ini draft. Hanya admin/author yang bisa melihatnya di daftar.",
        category: "random",
        status: "draft",
      },
    ].map((p, i) => ({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: null,
      status: p.status,
      publishedAt: p.status === "published" ? new Date(now.getTime() - i * 86400000) : null,
      viewCount: Math.floor(Math.random() * 200),
      authorId: author.id,
      categoryId: catBy(p.category),
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("posts", posts);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("posts", null, {});
    await queryInterface.bulkDelete("categories", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
