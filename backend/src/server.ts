import express, { Express } from "express";
import rootRouter from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initPassport } from "./config/passport";

const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

initPassport();
app.use(passport.initialize());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser("cookiee"));

app.use("/api", rootRouter);

export default app;
