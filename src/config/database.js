import initSqlJs from "sql.js";
import fs from "fs";

let db = null;

const initDB = async () => {
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });

  const filePath = "./database.db";

  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  console.log("📀 Database loaded (sql.js)");
  return db;
};

export default initDB;
