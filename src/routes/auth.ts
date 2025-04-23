import { Hono } from "hono";
import * as userController from "../controllers/user.controller.ts";

const router = new Hono();

router.get("/", (c) => {
  return c.text("Login Page s");
});

router.post("/signup", userController.createUser);
router.post("/signin", userController.loginUser);

export default router;
