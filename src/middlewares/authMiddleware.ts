import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler";
import { dbConnection } from "../config/dbs";
interface DecodedToken {
  id: string;
  role: string;
}
const db = dbConnection();
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      let decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      db.get(
        "SELECT ISLOCKED FROM USER_MASTER WHERE ID=?",
        [decoded.id],
        (err, row: any) => {
          if (decoded.id && row.ISLOCKED != 1) {
            next();
          } else {
            res.status(401);
            throw new Error("Not authorized , user locked");
          }
        }
      );
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized , token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized Token");
  }
});

const admin = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as DecodedToken;

      if (decoded.role === "admin") {
        next();
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized , token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized Token");
  }
});

export { protect, admin };
