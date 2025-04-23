import { getUserByEmail, insertUser } from "../db/queries/user.queries.ts";
import * as bcrypt from "bcrypt";

interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

export async function createUser(
  data: CreateUserInput,
) {
  const { username, email, password } = data;

  const existingUser = await getUserByEmail(email);

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
  const existingUser = await getUserByEmail(email);

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

  const user = {
    id: existingUser[0].id,
    username: existingUser[0].username,
    email: existingUser[0].email,
  };

  return user;
}
