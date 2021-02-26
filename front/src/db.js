import mysql from "mysql";
console.log(process.env);
const connection = mysql.createPool({
  host: process.env.MYSQL_SERVER || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "changeme",
  database: "trade",
});

connection.on("error", function (err) {
  connection.connect();
});

const mysqlConnection = {};
mysqlConnection.query = (q, data) => {
  const p = new Promise((resolve, reject) => {
    connection.query(q, data, (err, rows, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows, fields);
      }
    });
  });
  return p;
};

export default mysqlConnection;
