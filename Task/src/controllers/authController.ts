import { dbConnection } from "../config/dbs";
import asyncHandler from "../middlewares/asyncHandler";
import { comparePassword } from "../utils/comparePassword";
import generateToken from "../utils/generateToken";
import verifyToken from "../utils/verifyToken";
const db = dbConnection();
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  const query = `SELECT ID, PASSWORD, ROLE, ISLOCKED,EMAIL,MOBILE,LOGIN_ATTEMPT FROM USER_MASTER WHERE (EMAIL =? OR MOBILE =?)`;
  const params = [username, username];

  db.get(query, params, (err, row: any) => {
    let MAX_ATTEMPT = process.env.MAX_ATTEMPT || 5;
    if (err) {
      res.status(500).json({ message: "Internal Server Error" });
    } else if (row) {
      const passwordMatch = comparePassword(password, row.PASSWORD);

      if (row.ISLOCKED == 1) {
        res.status(401).json({ message: "Account Locked" });
      } else if (passwordMatch) {
        const token = generateToken(row.ID, row.ROLE);
        db.all("UPDATE USER_MASTER SET LOGIN_ATTEMPT=?,TOKEN=? WHERE ID=?", [
          0,
          token,
          row.ID,
        ]);
        res.status(200).json({ token });
      } else if (row.LOGIN_ATTEMPT < MAX_ATTEMPT) {
        let LOGIN_ATTEMPT: number = row.LOGIN_ATTEMPT
          ? row.LOGIN_ATTEMPT + 1
          : 1;
        db.all(
          "UPDATE USER_MASTER SET LOGIN_ATTEMPT=? WHERE ID=?",
          [LOGIN_ATTEMPT, row.ID],
          (err) => {
            if (!err) {
              res.status(401).json({ message: "Invalid password" });
            }
          }
        );
      } else if (row.LOGIN_ATTEMPT > MAX_ATTEMPT) {
        db.all(
          "UPDATE USER_MASTER SET ISLOCKED=? WHERE ID=?",
          [1, row.ID],
          (err) => {
            if (!err) {
              res.status(401).json({ message: "Invalid password" });
            }
          }
        );
      }
    } else {
      res.status(401).json({ message: "Invalid username" });
    }
  });
});

export const oneTimeLink = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const query = `SELECT ID,ROLE FROM USER_MASTER WHERE (EMAIL =? OR MOBILE =?)`;
  const params = [username, username];
  db.get(query, params, (err, row: any) => {
    if (err) {
      res.status(500).json(err);
    }
    console.log(row);
    let time = process.env.LINK_EXP;
    let token = generateToken(row.ID, row.ROLE, time);
    res.status(200).json(`api/verify-link?token=${token}`);
  });
});

export const verifyLink = asyncHandler(async (req, res) => {
  const { token } = req.query;
  let decode = verifyToken(token as string) as any;
  let time = process.env.LINK_EXP;
  if (!decode) {
    res.status(401).json({ message: "Invalid link" });
  } else {
    let new_token = generateToken(decode.ID, decode.ROLE, time);
    res.status(200).json(`api/verify-link?token=${new_token}`);
  }
});

export const getTimeAPI = asyncHandler(async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  let decode = verifyToken(token as string) as any;
  if (!decode) {
    res.status(401).json({ message: "Invalid token" });
  } else {
    res.status(200).json({ time: new Date().toISOString() });
  }
});

export const kickOutAPI = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const query = `SELECT ID FROM USER_MASTER WHERE EMAIL =? OR MOBILE =?;`;
  const params = [username, username];
  db.get(query, params, (err, row: any) => {
    if (err) {
      res.status(500).json(err);
    } else if (!row) {
      return res.status(404).json({ message: "User not found" });
    } else {
      db.all("UPDATE USER_MASTER SET ISLOCKED=1 WHERE ID=?", [row.ID]);
      res.status(200).json({ message: "Successful kicked" });
    }
  });
});
