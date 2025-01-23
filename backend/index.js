import express from "express";
import cors from "cors";
import authRouter from "./router/auth.js";
import codeRouter from "./router/code.js";
import problemStatementRouter from "./router/problem-statement.js";
import leaderboardRouter from "./router/leaderboard.js";
import userRouter from "./router/user.js";
import editorialsRouter from "./router/editorial.js";
import logger from "morgan";
import morgan from "morgan";
import { getIp } from "./utils/ip-addr.js";

const app = express();

morgan.token("user-id", (req, _) => {
    return req.user != undefined ? req.user.id : "Unauthenticated";
});
morgan.token("ip", (req, _) => {
    return getIp(req);
});
app.enable("trust proxy");
app.use(
    logger(
        `[:date[web]] :ip - ":method :url HTTP/:http-version" :status ":referrer" ":user-agent" User::user-id - :response-time ms`,
    ),
);
app.use(express.json());
app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);

app.use("/auth", authRouter);
app.use("/code", codeRouter);
app.use("/problem-statement", problemStatementRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/user", userRouter);
app.use("/editorial/:problemStatementId", editorialsRouter);

app.use(function (req, res, next) {
    res.status(404).json({
        success: false,
        message: "This route could not be found",
        data: null,
    });
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    console.log(err)
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500).json({
        success: false,
        message: "An unexpected error occured",
        data: null,
    });
});

export default app;
