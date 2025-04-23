import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";

const client = postgres(
  Deno.env.get("DATABASE_URL") ||
    "postgresql://postgres:admin@localhost:5432/blog",
);

export const db = drizzle(client, { schema });
