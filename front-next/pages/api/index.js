import nextConnect from 'next-connect'
import auth from '../../middleware/auth'
import connection from '../../services/db'

const handler = nextConnect()

handler
  .use(auth)
  .get((req, res) => {
    try {
      connection
        .query('SELECT * FROM trade WHERE userId = ?', [req.user.id])
        .then(
          (rows, fields) => {
            res.json({ rows: rows, fields: fields })
          },
          (err) => {
            console.log(err)
            res.send(err)
          }
        )
    } catch (e) {
      res.status(500).send('api', e)
    }
  })

export default handler