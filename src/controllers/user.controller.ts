import { z } from "zod";
import { Context } from "hono";
import * as userService from "../services/user.service.ts";

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function createUser(c: Context) {
  try {
    const data = await c.req.json();
    const validatedData = createUserSchema.parse(data);
    const result = await userService.createUser(validatedData);

    return c.json(result, 201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ message: "Invalid input" }, 400);
    }
    if (err instanceof Error) {
      return c.json({
        message: err.message,
      });
    }
  }
}

export async function loginUser(c: Context) {
  try {
    const data = await c.req.json();
    const validatedData = loginUserSchema.parse(data);
    const result = await userService.loginUser(validatedData);

    return c.json(result, 200);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ message: "Invalid input" }, 400);
    }
    if (err instanceof Error) {
      return c.json({
        message: err.message,
      }, 400);
    }
  }
}
