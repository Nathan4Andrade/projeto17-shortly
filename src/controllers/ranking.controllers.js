import { db } from "../database/database.connection.js";

export async function ranking(req, res) {
  try {
    const ranking = await db.query(`
            SELECT users.id, users.name, COUNT(links."url") AS "linksCount", SUM(links."visitCount") AS "visitCount"
            FROM users
            JOIN links ON users.id = links."userId"
            GROUP BY users.id, users.name
            ORDER BY "visitCount" DESC
            lIMIT 10;`);
    res.send(ranking.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
