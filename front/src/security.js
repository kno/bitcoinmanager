import { ExtractJwt, Strategy } from "passport-jwt";
import connection from "./db";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "lincoin-manager";

export const security = (passport) => {
  passport.use(
    new Strategy(opts, (jwt_payload, done) => {
      connection
        .query("SELECT * FROM users WHERE id = ? LIMIT 1", jwt_payload.id)
        .then((result, error, fields) => {
          // if no user is found, return the message
          if (!result || result.length === 0) return done(null, false);
          // all is well, return successful user
          return done(null, result[0]);
        });
    })
  );
};

export const security_V1 = async (req, res, next) => {
  const loginData = JSON.parse(req.headers.authorization);
  if (loginData.username && loginData.password) {
    connection
      .query(
        "SELECT * FROM users WHERE username = ? LIMIT 1",
        loginData.username
      )
      .then(async (results, error, fields) => {
        if (!results || results.length === 0) {
          res.status(401).send();
        } else {
          try {
            const passwordOk = await bcrypt.compare(
              loginData.password,
              results[0].password
            );
            if (passwordOk) {
              req.params.userId = results[0].id;
              next();
            } else {
              res.status(401).send();
            }
          } catch (error) {
            console.log("Error bcrypt", error);
            res.status(401).send();
          }
        }
      });
  } else {
    res.status(401).send();
  }
};
