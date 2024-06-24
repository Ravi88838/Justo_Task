import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./config/dbs";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";
import Auth from "./routes/authRoutes";
dotenv.config();
const app: Application = express();
app.use(cors());
dbConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 2000;

app.use("/api", Auth);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
