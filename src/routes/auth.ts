import { Hono } from "hono";
import * as userController from "../controllers/user.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

type Variables = {
  user: string;
};

const router = new Hono<{ Variables: Variables }>();

router.get("/", (c) => {
  return c.text("Login Page s");
});

router.post("/signup", userController.createUser);
router.post("/signin", userController.loginUser);
router.post("/refresh-token", userController.updateUserAccessToken);

// protected routes
router.get("/profile", authMiddleware, (c) => {
  const user = c.get("user");
  return c.text(`Profile Page:  ${JSON.stringify(user)}`);
});

export default router;
