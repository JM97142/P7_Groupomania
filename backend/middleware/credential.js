// Importation des modules
const Cookies = require('cookies');
const cryptojs = require('crypto-js');
require('dotenv').config();

const database = require('../utils/database');


// Vérification Id utilisateur = Id cookie
exports.sameUser = (req, res, next) => {
    const cryptedCookie = new Cookies(req, res).get('snToken');
    const cookie = JSON.parse(cryptojs.AES.decrypt(cryptedCookie, process.env.COOKIE_KEY).toString(cryptojs.enc.Utf8));
    if (req.params.id == cookie.userId) {
        next();
    } else {
        res.status(403).json({ error: 'Accès refusé' });
    }
}

// Vérification droits administrateur
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