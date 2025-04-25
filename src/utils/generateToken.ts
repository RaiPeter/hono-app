import { sign } from "hono/jwt";

export const generateAccessToken = (id: number) => {
  return sign(
    { id, expiresIn: "1h" },
    Deno.env.get("ACCESS_TOKEN_KEY") || "your-secret-key",
  );
};

export const generateRefreshToken = (id: number) => {
  return sign(
    { id, expiresIn: "30d" },
    Deno.env.get("REFRESH_TOKEN_KEY") || "your-secret-key",
  );
};

export const generateAccessTokenAndRefreshToken = async (id: number) => {
  const accessToken = await generateAccessToken(id);
  const refreshToken = await generateRefreshToken(id);

  return { accessToken, refreshToken };
};
