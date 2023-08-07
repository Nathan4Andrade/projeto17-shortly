import { nanoid } from "nanoid";
import { db } from "../database/database.connection.js";

export async function shorten(req, res) {
  const { url } = req.body;
  const { user } = res.locals;
  try {
    const shortUrl = nanoid(8);

    const { rows } = await db.query(
      `INSERT INTO links ("userId", url, "shortUrl", ) VALUES ($1, $2, $3) RETURNING id, "shortUrl";`,
      [user.id, url, shortUrl]
    );

    res.status(201).send(rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteURL(req, res) {
  const { user } = res.locals;
  const { id } = req.params;
  try {
    const userId = await db.query(`SELECT "userId" FROM links WHERE id=$1;`, [
      id,
    ]);

    if (userId.rowCount === 0)
      return res.status(404).send("Url não encontrada");
    if (userId.rows[0].userId !== user.id)
      return res.status(401).send("Url não pertence ao usuário!");

    await db.query(`DELETE FROM links WHERE id=$1;`, [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getUrlById(req, res) {
  const { id } = req.params;

  try {
    const url = (
      await db.query(
        `SELECT links.id, links."shortUrl", links.url FROM links WHERE id=$1`,
        [id]
      )
    ).rows[0];
    if (!url) return res.sendStatus(404);

    res.status(200).send(url);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
export async function openShortUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const link = (
      await db.query(`SELECT * FROM links WHERE "shortUrl"=$1`, [shortUrl])
    ).rows[0];
    if (!link) return res.sendStatus(404);

    const visit = link.visitCount + 1;
    await db.query(`UPDATE links SET "visitCount"=$1 WHERE "shortUrl"=$2`, [
      visit,
      shortUrl,
    ]);

    res.redirect(link.url);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
