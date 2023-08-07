import { db } from "../database/database.connection.js";

export async function validateAuth(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).send("Não autorizado");

  try {
    const session = await db.query(`SELECT * FROM sessions WHERE token=$1`, [
      token,
    ]);
    if (!session.rows[0]) return res.status(401).send("Não autorizado");

    const user = await db.query(`SELECT * FROM users WHERE id=$1`, [
      session.rows[0].userId,
    ]);
    if (!user.rows[0]) return res.sendStatus(401);

    delete user.password;
    res.locals.user = user.rows[0];
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
