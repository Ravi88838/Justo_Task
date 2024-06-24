import { verbose } from "sqlite3";
export const dbConnection = () => {
  const sqlite3 = verbose();
  const db = new sqlite3.Database("Database.db", (err) => {
    if (err) {
      console.log(`DB connection ${err}`);
    }
  });
  return db;
};
