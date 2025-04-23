import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL") ||
      "postgresql://postgres:admin@localhost:5432/blog",
  },
});
