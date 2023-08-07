import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db } from "../database/database.connection.js";

export async function signup(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  const hashPass = bcrypt.hashSync(password, 10);

  try {
    if (confirmPassword !== password)
      return res.status(422).send("As senhas estão diferentes!");
    const existingEmail = await db.query(`SELECT * from users WHERE email=$1`, [
      email,
    ]);
    if (existingEmail.rowCount > 0)
      return res.status(409).send("E-mail já cadastrado");

    await db.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
      [name, email, hashPass]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function signin(req, res) {
  const { email, password } = req.body;
  const token = uuid();

  try {
    const user = (await db.query(`SELECT * from users WHERE email=$1`, [email]))
      .rows[0];

    if (!user || !bcrypt.compareSync(password, user.password))
      return res.sendStatus(401);

    await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2)`, [
      user.id,
      token,
    ]);
    res.status(200).send({ token: token });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getMe(req, res) {
  const { user } = res.locals;
  try {
    const links = (
      await db.query(
        `SELECT links.id, links.url, links."shortUrl", links."visitCount" FROM links WHERE links."userId"=$1`,
        [user.id]
      )
    ).rows;

    const userUrlsInfo = {
      ...user,
      shortenedUrls: links.map((url) => ({
        id: url.id,
        url: url.url,
        shortUrl: url.shortUrl,
        visitCount: url.visitCount,
      })),
    };

    res.send(userUrlsInfo);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
