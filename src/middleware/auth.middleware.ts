import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { findUserById } from "../db/queries/user.queries.ts";
import { getCookie } from "hono/cookie";

export async function authMiddleware(c: Context, next: Next) {
  try {
    const token = getCookie(c, "accessToken") ||
      c.req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return c.json({ message: "Unauthorized - No token provided" }, 401);
    }

    const payload = await verify(
      token,
      Deno.env.get("JWT_SECRET") || "your-secret-key",
    );

    const user = await findUserById(parseInt(payload?.id as string));
    console.log(user);

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }
    // Add user data to the context for use in protected routes
    c.set("user", user);
    await next();
  } catch (error) {
    console.error(error);

    return c.json({ message: "Unauthorized - Invalid token" }, 401);
  }
}
