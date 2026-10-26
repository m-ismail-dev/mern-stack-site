import "dotenv/config";
import { defineConfig } from "prisma/config";

const sqlite = process.env.DB_CLIENT === "sqlite";

export default defineConfig({
  schema: sqlite ? "prisma/schema.sqlite.prisma" : "prisma/schema.prisma",
  migrations: {
    path: sqlite ? "prisma/sqlite/migrations" : "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});