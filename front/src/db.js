import mysql from "mysql";
console.log(process.env);
const connection = mysql.createPool(process.env.MYSQL_CONNECTION_STRING);

connection.on("error", function (err) {
  connection.connect();
});

const mysqlConnection = {
  query: (q, data) => {
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
  },
};

export default mysqlConnection;
