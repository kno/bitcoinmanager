import bcrypt from "bcrypt";
import connection from "../../services/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  try {
    const results = await connection
      .query(
        "SELECT * FROM users WHERE username = ? LIMIT 1",
        req.body.username
      );
    if (!results || results.length === 0) {
      return res.status(401).send();
    }
    try {
      const passwordOk = await bcrypt.compare(
        req.body.password,
        results[0].password
      );
      if (passwordOk) {
        var payload = { id: results[0].id };
        var opts = { secretOrKey: "lincoin-manager" };
        var token = jwt.sign(payload, opts.secretOrKey, {
          expiresIn: "1y",
        });
        res.json({ message: "ok", token: token });
      } else {
        res.status(401).send();
      }
    } catch (error) {
      console.log("Error bcrypt", error);
      res.status(401).send();
    }

  } catch (e) {
    res.status(500).send(e);
  }
}
