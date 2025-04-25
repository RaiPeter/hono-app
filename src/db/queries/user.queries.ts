import { db } from "../index.ts";
import { users } from "../schema.ts";
import { and, getTableColumns, InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

type UserInsert = InferInsertModel<typeof users>;

export async function insertUser(data: UserInsert) {
  const { password: _password, ...rest } = getTableColumns(users);
  return await db.insert(users).values(data).returning({
    ...rest,
  });
}

export async function findUserByEmail(email: string) {
  return await db
    .select()
    .from(users)
    .where(eq(users.email, email));
}

export async function findUserByEmailAndPassword(
  email: string,
  pass: string,
) {
  const { password: _password, ...rest } = getTableColumns(users);
  return await db
    .select({
      ...rest,
    })
    .from(users)
    .where(and(eq(users.email, email), eq(users.password, pass)));
}

export async function findUserById(id: number) {
  const { password, ...rest } = getTableColumns(users);
  return await db
    .select({
      ...rest,
    })
    .from(users)
    .where(eq(users.id, id));
}

export async function insertUserRefreshToken(
  id: number,
  refreshToken: string,
) {
  return await db
    .update(users)
    .set({ refreshToken: refreshToken })
    .where(eq(users.id, id));
}

// export async function updateUserAccessToken(
//   id: number,
//   refreshToken: string,
// ) {
//   return await db
//     .update(users)
//     .set({ refreshToken: refreshToken })
//     .where(eq(users.id, id));
// }

export async function findUserByRefreshToken(refreshToken: string) {
  return await db
    .select()
    .from(users)
    .where(eq(users.refreshToken, refreshToken));
}
