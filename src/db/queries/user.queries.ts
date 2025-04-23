import { db } from "../index.ts";
import { users } from "../schema.ts";
import { and, getTableColumns, InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

type UserInsert = InferInsertModel<typeof users>;

export async function insertUser(data: UserInsert) {
  const { password, ...rest } = getTableColumns(users);
  return await db.insert(users).values(data).returning({
    ...rest,
  });
}

export async function getUserByEmail(email: string) {
  return await db
    .select()
    .from(users)
    .where(eq(users.email, email));
}

export async function getUserByEmailAndPassword(
  email: string,
  pass: string,
) {
  const { password, ...rest } = getTableColumns(users);
  return await db
    .select({
      ...rest,
    })
    .from(users)
    .where(and(eq(users.email, email), eq(users.password, pass)));
}
