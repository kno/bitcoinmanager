"use strict";

import cors from "cors";
import express from "express";
import connection from "../../src/db.js";

// Constants
const PORT = process.env.PORT || 8080;
const HOST = process.env.IP || "0.0.0.0";

// App
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  console.log("root");
  connection.query("select * from trade").then(
    (rows, fields) => {
      console.log("query executed");
      console.log(fields, rows);
      res.json({ rows: rows, fields: fields });
    },
    (err) => {
      console.log(err);
      res.send(err);
    }
  );
});

app.post("/api", (req, res) => {
  connection.query("INSERT INTO trade SET ?", req.body).then(
    (error, results, fields) => {
      if (error) {
        res.send(error);
      }
      res.send(results);
    }
  )
});

app.delete('/api/:id', (req,res) => {
  connection.query("DELETE FROM trade where id = ?", req.params.id).then(
    (error, results, fields) => {
      if (error) {
        res.send(error);
      }
      res.send(results);
    }
  )
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
