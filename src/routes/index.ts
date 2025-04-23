// src/routes/index.ts
import { Hono } from "hono";
import userRouter from "./auth.ts";

const app = new Hono();

app.route("/auth", userRouter);

export default app;
