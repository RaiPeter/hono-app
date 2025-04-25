import { z } from "zod";
import { Context } from "hono";
import * as userService from "../services/user.service.ts";
import { CookieOptions } from "hono/utils/cookie";
import { getCookie, setCookie } from "hono/cookie";
import { access } from "node:fs";

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  accessToken: z.string().optional(),
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
    const user = await userService.loginUser(validatedData);

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    };
    setCookie(c, "accessToken", user?.accessToken, cookieOptions);
    setCookie(c, "refreshToken", user?.refreshToken, cookieOptions);

    return c.json({ data: user, message: "Logged in succesfully" }, 200);
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

export async function updateUserAccessToken(c: Context) {
  try {
    const requestBody = await c.req.json();
    const refreshToken = requestBody.refreshToken ||
      getCookie(c, "refreshToken");
    console.log(refreshToken, "asdfa");

    if (!refreshToken) {
      return c.json({ message: "Refresh token not found" }, 400);
    }
    const accessToken = await userService.updateAccessToken(refreshToken);

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    };
    setCookie(c, "accessToken", accessToken, cookieOptions);

    return c.json({ message: "Access token updated succesfully." }, 201);
  } catch (err) {
    if (err instanceof Error) {
      return c.json({
        message: err.message,
      }, 400);
    }
  }
}
