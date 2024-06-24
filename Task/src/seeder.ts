import { dbConnection } from "./config/dbs";
import { data } from "./data/index";
const db = dbConnection();

const importData = async () => {
  for (let val of data) {
    await db.exec(val);
  }
  await db.close();
};
importData();
