import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDB } from "./server";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import router from "./routes/routes";
import { Server } from "http";
import cookieParser from "cookie-parser";

//Initialize dotenv variable access
dotenv.config();
export const mongoUrl = process.env.MONGODB_URL;
export const nodeEnv = process.env.NODE_ENV;
export const serverPort = process.env.SERVER_PORT;
export const saltRound = process.env.SALT_ROUND;
export const defPass = process.env.DEFAULT_PASS;
export const jwt_access_secret = process.env.JWT_SECRET;
export const jwt_refresh_secret = process.env.JWT_REFRESH_SECRET;
export const jwt_access_expire = process.env.JWT_ACCESS_EXPIRES_IN;
export const jwt_refresh_expire = process.env.JWT_REFRESH_EXPIRES_IN;
export const stripe_secret = process.env.STRIPE_SECRET;

//Connect Mongodb
connectToDB();

//Initialize app
const app = express();

//Primary middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://snoke-stationary-front.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

//Applicatin route
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Snoke stationary shops");

  // Promise.reject();
});

const server: Server = app.listen(serverPort, () => {
  console.log(`Stationary shop is listening on ${serverPort}`);
});

//Global error handler
app.use(errorHandler);

app.use("/", notFound);

//Export for vercel configuration
export default app;

//For asynchronous process
process.on("unhandledRejection", () => {
  console.log(`unhandledRejection is detected, shutting down server...`);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

//For synchronous process
process.on("uncaughtException", () => {
  console.log(`uncaughtException is detected, shutting down server...`);

  process.exit(1);
});
