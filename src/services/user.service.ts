import {
  findUserByEmail,
  findUserById,
  insertUser,
  insertUserRefreshToken,
} from "../db/queries/user.queries.ts";
import * as bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateAccessTokenAndRefreshToken,
} from "../utils/generateToken.ts";
import { verify } from "hono/jwt";
import { use } from "hono/jsx";

interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

export async function createUser(
  data: CreateUserInput,
) {
  const { username, email, password } = data;

  const existingUser = await findUserByEmail(email);

  if (existingUser.length > 0) {
    console.log("User already exists");

    throw new Error("User already exists");
  }

  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = {
    username,
    email,
    password: hashedPassword,
  };

  const [createdUser] = await insertUser(user);

  if (!createdUser) {
    console.log("User creation failed");
    throw new Error("User creation failed");
  }

  return createdUser;
}

export async function loginUser(data: { email: string; password: string }) {
  const { email, password } = data;

  // Check if the user already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser.length === 0) {
    console.log("User not found", existingUser[0]);
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    existingUser[0].password,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(existingUser[0].id);

  const updatedUser = await insertUserRefreshToken(
    existingUser[0].id,
    refreshToken,
  );

  if (!updatedUser) {
    console.log("Failed to update user refresh token");
    throw new Error("Failed to update user refresh token");
  }

  const user = {
    id: existingUser[0].id,
    username: existingUser[0].username,
    email: existingUser[0].email,
    accessToken,
    refreshToken,
    createdAt: existingUser[0].created_at,
  };

  return user;
}

export async function updateAccessToken(
  refreshToken: string,
) {
  if (!refreshToken) {
    console.log("Refresh token not found");
    throw new Error("Refresh token not found");
  }

  const decodedToken = await verify(
    refreshToken,
    Deno.env.get("REFRESH_TOKEN_KEY") || "your-secret-key",
  );

  const userFound = await findUserById(parseInt(decodedToken?.id as string));

  if (!userFound) {
    console.log("User not found");
    throw new Error("User not found");
  }

  if (userFound[0].refreshToken !== refreshToken) {
    console.log("Invalid refresh token");
    throw new Error("Invalid refresh token");
  }

  const accessToken = await generateAccessToken(userFound[0].id);

  return accessToken;
}
