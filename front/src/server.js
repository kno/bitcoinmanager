import App from "./App";
import React from "react";
import { StaticRouter } from "react-router-dom";
import express from "express";
import { renderToString } from "react-dom/server";
import connection from "./db.js";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server.use(express.json());

const security = (req, res, next) => {
  console.log(process.env.SECRET)
  if (req.headers.authorization != process.env.SECRET) {
    res.status(401).send();
  } else {
    next();
  }
}

server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))

  .get("/api", security, (req, res) => {
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
  })

  .post("/api", security, (req, res) => {
    connection
      .query("INSERT INTO trade SET ?", req.body)
      .then((error, results, fields) => {
        if (error) {
          res.send(error);
        }
        res.send(results);
      });
  })

  .delete("/api/:id", security, (req, res) => {
    connection
      .query("DELETE FROM trade where id = ?", req.params.id)
      .then((error, results, fields) => {
        if (error) {
          res.send(error);
        }
        res.send(results);
      });
  })

  .get("/*", (req, res) => {
    const context = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Bitcoin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ""
        }
        ${
          process.env.NODE_ENV === "production"
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
      );
    }
  });

export default server;
