equire('dotenv').config();
const Cookies = require('cookies');
const cryptojs = require('crypto-js');

const database = require('../utils/database');

// Nouveau commentaire
exports.newComment = (req, res, next) => {
  const connection = database.connect();

  const cryptedCookie = new Cookies(req, res).get('snToken');
  const userId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;
  const postId = req.body.postId;
  const content = req.body.content;

  const sql = "INSERT INTO Comments (user_id, post_id, content)\
  VALUES (?, ?, ?);";
  const sqlParams = [userId, postId, content];

  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
          res.status(201).json({ message: 'Commentaire ajoutée' });
    }
  });
  connection.end();
}