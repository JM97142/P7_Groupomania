// Importation des modules
const Cookies = require("cookies");
const cryptojs = require("crypto-js");
require("dotenv").config();

const database = require("../utils/database");
const fs = require("fs");

// Nouvelle publication
exports.newPost = (req, res, next) => {
  const connection = database.connect();

  const cryptedCookie = new Cookies(req, res).get("snToken");
  const userId = JSON.parse(
    cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(
      cryptojs.enc.Utf8
    )
  ).userId;
  const imageurl = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : null;
  const content = req.body.content ? req.body.content : null;

  const sql =
    "INSERT INTO Posts (user_id, imageurl, content)\
  VALUES (?, ?, ?);";
  const sqlParams = [userId, imageurl, content];

  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: error.sqlMessage });
    } else {
      res.status(201).json({ message: "Publication ajoutée" });
    }
  });

  connection.end();
};

// Récupération des posts avec commentaires et likes/dislikes
exports.getCommentsOfEachPosts = (posts, connection) => {
  return Promise.all(
    posts.map((post) => {
      const sql =
        "SELECT Comments.id AS commentId, Comments.publication_date AS commentDate, Comments.content As commentContent, Users.id AS userId, Users.name AS userName, Users.pictureurl AS userPicture\
                FROM Comments\
                INNER JOIN Users ON Comments.user_id = Users.id\
                WHERE Comments.post_id = ?";
      const sqlParams = [post.postId];
      return new Promise((resolve, reject) => {
        connection.execute(sql, sqlParams, (error, comments, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve({ ...post, comments });
          }
        });
      });
    })
  );
};

// Fonction utilitaire : Récupérer les like/dislikes des posts
exports.getLikesOfEachPosts = (posts, userId, connection) => {
  return Promise.all(
    posts.map((post) => {
      const postId = post.postId;
      const sql =
        "SELECT\
                (SELECT COUNT(*) FROM Likes WHERE (post_id=? AND rate=1)) AS LikesNumber,\
                (SELECT COUNT(*) FROM Likes WHERE (post_id=? AND rate=-1)) AS DislikesNumber,\
                (SELECT rate FROM Likes WHERE (post_id=? AND user_id=?)) AS currentUserReaction";
      const sqlParams = [postId, postId, postId, userId];
      return new Promise((resolve, reject) => {
        connection.execute(sql, sqlParams, (error, result, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve({ ...post, likes: result[0] });
          }
        });
      });
    })
  );
};

// Récupération de tous les posts avec commentaires et likes/dislikes
exports.getAllPosts = (req, res, next) => {
  const connection = database.connect();

  const sql =
    "SELECT Posts.id AS postId, Posts.publication_date AS postDate, Posts.imageurl AS postImage, Posts.content as postContent, Users.id AS userId, Users.name AS userName, Users.pictureurl AS userPicture\
  FROM Posts\
  INNER JOIN Users ON Posts.user_id = Users.id\
  ORDER BY postDate DESC";
  connection.execute(sql, (error, rawPosts, fields) => {
    if (error) {
      connection.end();
      res.status(500).json({ error: error.sqlMessage });
    } else {
      this.getCommentsOfEachPosts(rawPosts, connection)
        .then((postsWithoutLikes) => {
          const cryptedCookie = new Cookies(req, res).get("snToken");
          const userId = JSON.parse(
            cryptojs.AES.decrypt(
              cryptedCookie,
              process.env.COOKIE_KEY
            ).toString(cryptojs.enc.Utf8)
          ).userId;
          this.getLikesOfEachPosts(postsWithoutLikes, userId, connection)
            .then((posts) => {
              res.status(200).json({ posts });
            })
            .catch((err) => {
              res.status(500).json({ error: "Un problème est survenu" });
            });
        })
        .catch((err) => {
          res.status(500).json({ error: "Un problème est survenu" });
        });
    }
  });
};

// Récupération de plusieurs posts
exports.getSomePosts = (req, res, next) => {
  const connection = database.connect();
  const limit = parseInt(req.params.limit);
  const offset = parseInt(req.params.offset);
  const sql =
    "SELECT Posts.id AS postId, Posts.publication_date AS postDate, Posts.imageurl AS postImage, Posts.content as postContent, Users.id AS userId, Users.name AS userName, Users.pictureurl AS userPicture\
  FROM Posts\
  INNER JOIN Users ON Posts.user_id = Users.id\
  ORDER BY postDate DESC\
  LIMIT ? OFFSET ?;";
  const sqlParams = [limit, offset];
  connection.execute(sql, sqlParams, (error, rawPosts, fields) => {
    if (error) {
      connection.end();
      res.status(500).json({ error: error.sqlMessage });
    } else {
      this.getCommentsOfEachPosts(rawPosts, connection).then(
        (postsWithoutLikes) => {
          const cryptedCookie = new Cookies(req, res).get("snToken");
          const userId = JSON.parse(
            cryptojs.AES.decrypt(
              cryptedCookie,
              process.env.COOKIE_KEY
            ).toString(cryptojs.enc.Utf8)
          ).userId;
          this.getLikesOfEachPosts(postsWithoutLikes, userId, connection).then(
            (posts) => {
              res.status(200).json({ posts });
            }
          );
        }
      );
    }
  });
};

// Récupération d'un post
exports.getOnePost = (req, res, next) => {
  const connection = database.connect();
  const postId = parseInt(req.params.id);
  const sql =
    "SELECT Posts.id AS postId, Posts.publication_date AS postDate, Posts.imageurl AS postImage, Posts.content as postContent, Users.id AS userId, Users.name AS userName, Users.pictureurl AS userPicture\
  FROM Posts\
  INNER JOIN Users ON Posts.user_id = Users.id\
  WHERE Posts.id = ?\
  ORDER BY postDate DESC";
  const sqlParams = [postId];
  connection.execute(sql, sqlParams, (error, rawPosts, fields) => {
    if (error) {
      connection.end();
      res.status(500).json({ error: error.sqlMessage });
    } else {
      this.getCommentsOfEachPosts(rawPosts, connection).then(
        (postsWithoutLikes) => {
          const cryptedCookie = new Cookies(req, res).get("snToken");
          const userId = JSON.parse(
            cryptojs.AES.decrypt(
              cryptedCookie,
              process.env.COOKIE_KEY
            ).toString(cryptojs.enc.Utf8)
          ).userId;
          this.getLikesOfEachPosts(postsWithoutLikes, userId, connection).then(
            (post) => {
              res.status(200).json({ post });
            }
          );
        }
      );
    }
  });
};

// Suppression d'un post
exports.deletePost = (req, res, next) => {
  const connection = database.connect();
  const postId = parseInt(req.params.id, 10);
  const sql = "DELETE FROM Posts WHERE id=?;";
  const sqlParams = [postId];

  connection.query(
    "SELECT Posts.id AS postId, Posts.publication_date AS postDate, Posts.imageurl AS postImage, Posts.content as postContent, Users.id AS userId, Users.name AS userName, Users.pictureurl AS userPicture\
    FROM Posts\
    INNER JOIN Users ON Posts.user_id = Users.id\
    WHERE Posts.id = ?\
    ORDER BY postDate DESC",
    [req.params.id],
    function (error, results, fields) {
      if (error) res.status(500).json({ error: error });
      imageUrl = results[0].postImage;
      const filename = imageUrl.split("/images/")[1];
      fs.unlinkSync(`images/${filename}`);
    }
  );

  connection.execute(sql, sqlParams, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: error.sqlMessage });
    } else {
      res.status(201).json({ message: "Publication supprimée" });
    }
  });
  connection.end();
};
