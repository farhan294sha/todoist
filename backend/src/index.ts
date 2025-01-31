/// <reference path="./types/express.d.ts" />
import app from "./server";
import { connectDB } from "./db";
import { config } from "./secrets";
import { errorMiddleware } from "./middlewares/error";

connectDB();

app.use(errorMiddleware);

app.listen(config.PORT, () => {
  console.log(`App is running on PORT ${config.PORT}`);
});
