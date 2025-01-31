import { Router } from "express";
import { googleLogin, login, logout, me, newAccessToken, signup } from "../controllers/auth";
import { erroHandler } from "../errorHandler";
import { authMiddleware } from "../middlewares/authMiddlewares";
import passport from "passport";

const authRouter: Router = Router();

authRouter.post("/signup", erroHandler(signup));
authRouter.post("/login", erroHandler(login));
authRouter.get("/refreshToken", erroHandler(newAccessToken));
authRouter.get("/logout", [authMiddleware], erroHandler(logout));
authRouter.get("/me", authMiddleware, erroHandler(me));
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile","email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }), googleLogin);



authRouter.get("login-fail", (req, res) => {
    res.json({messg: "login failed"})
})

export default authRouter;
