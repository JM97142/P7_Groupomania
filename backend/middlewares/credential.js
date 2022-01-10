// Importation modules
const Cookies = require("cookies");
const cryptojs = require("crypto-js");
const database = require("../utils/database");
require("dotenv").config();


// Vérification Id utilisateur = Id stocké dans le cookie
exports.sameUser = (req, res, next) => {
  const cryptedCookie = new Cookies(req, res).get('snToken');
  const cookie = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8));
  if (req.params.id == cookie.userId) {
    next();
  } else {
    res.status(403).json({ error: 'Accès refusé' });
  }
}

// Vérification que l'utilisateur a bien les droits administrateur
exports.isAdmin = (req, res, next) => {
  const connection = database.connect();
  const cryptedCookie = new Cookies(req, res).get('snToken');
  const cookie = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8));
  const userId = cookie.userId;
  const sql = "SELECT isadmin FROM Users WHERE id=?";
  const sqlParams = [userId]
  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      if (results[0].isadmin === 1) {
        next();
      } else {
        res.status(403).json({ error: 'Accès refusé' });
      }
    }
  });
}

// Vérification des autorisations pour la suppression d'un post
exports.deletePost = (req, res, next) => {
  const connection = database.connect();
  const cryptedCookie = new Cookies(req, res).get('snToken');
  const cookie = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8));
  const userId = cookie.userId;
  const sql = "SELECT isadmin FROM Users WHERE id=?";
  const sqlParams = [userId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      if (results[0].isadmin === 1) {
        next();
      } else {
        const postId = req.params.id;
        const sql2 = "SELECT user_id FROM Posts WHERE id=?";
        const sqlParams2 = [postId];
        connection.execute(sql2, sqlParams2, (error, results, fields) => {
          if (error) {
            res.status(500).json({ "error": error.sqlMessage });
          } else if (results.length === 0) {
            res.status(422).json({ "error": "Cette publication n'existe pas" });
          } else {
            const postAuthorId = results[0].user_id;
            if (postAuthorId === parseInt(userId, 10)) {
              next();
            } else {
              res.status(403).json({ error: 'Accès refusé' });
            }
          }
        });
        connection.end();
      }
    }
  });
}

// Vérification des autorisations pour la suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
  const connection = database.connect();
  const cryptedCookie = new Cookies(req, res).get('snToken');
  const cookie = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8));
  const userId = cookie.userId;
  const sql = "SELECT isadmin FROM Users WHERE id=?";
  const sqlParams = [userId];
  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else {
      if (results[0].isadmin === 1) {
        connection.end();
        next();
      } else {
        const commentId = req.params.id;
        const sql2 = "SELECT user_id FROM Comments WHERE id=?";
        const sqlParams2 = [commentId];
        connection.execute(sql2, sqlParams2, (error, results, fields) => {
          if (error) {
            res.status(500).json({ "error": error.sqlMessage });
          } else if (results.length === 0) {
            res.status(422).json({ "error": "Ce commentaire n'existe pas" });
          } else {
            const commentAuthorId = results[0].user_id;
            if (commentAuthorId === parseInt(userId, 10)) {
              next();
            } else {
              res.status(403).json({ error: 'Accès refusé' });
            }
          }
        });
        connection.end();
      }
    }
  });
}


// Vérification des autorisations pour la suppression d'une notification
exports.deleteNotification = (req, res, next) => {
  const connection = database.connect();

  const cryptedCookie = new Cookies(req, res).get('snToken');
  const userId = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8)).userId;
  const notificationId = req.params.id;

  const sql = "SELECT user_id FROM Notifications WHERE id = ?";
  const sqlParams = [notificationId]

  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ "error": error.sqlMessage });
    } else if (results.length === 0) {
      res.status(422).json({ "error": "Cette notification n'existe pas" });
    } else {
      const notificationUserId = results[0].user_id;
      if (notificationUserId === parseInt(userId, 10)) {
        next();
      } else {
        res.status(403).json({ error: 'Accès refusé' });
      }
    }
  })
}