// Importation des modules
const Cookies = require("cookies");
const cryptojs = require("crypto-js");
const fs = require("fs");
require("dotenv").config();

const database = require("../utils/database");

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