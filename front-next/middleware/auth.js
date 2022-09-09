import nextConnect from 'next-connect'
import passport from 'passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import connection from '../services/db'

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = 'lincoin-manager'

const security = new Strategy(opts, async (jwt_payload, done) => {
  try {
    const result = await connection
      .query('SELECT * FROM users WHERE id = ? LIMIT 1', jwt_payload.id)
    // if no user is found, return the message
    if (!result || result.length === 0) return done(null, false)
    // all is well, return successful user
    return done(null, result[0])
  } catch (e) {
    console.log('Security Error', e)
    return done(null, false)
  }
})

passport.use(security)

const auth = nextConnect()
  .use(passport.initialize())
  .use(passport.authenticate('jwt', { session: false }))

export default auth