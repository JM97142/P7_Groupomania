// Importation des modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Nouvelle utilisateur
exports.newuser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            const connection = database.connect();
            const name = req.body.name;
            const email = req.body.email;
            const password = cryptojs.AES.encrypt(
            hash,
            process.env.CRYPT_USER_INFO
            ).toString();
            let isAdmin;
        // le premier User créé sera un administrateur.
            const preliminarySql = "SELECT COUNT(*) AS numberOfUsers FROM Users;";

            connection.query(preliminarySql, (error, result, fields) => {
                if (error) {
                    console.log(error);
                    connection.end();
                    res.status(500).json({ error: error.sqlMessage });
                } else {
                console.log(result);
                if (result[0].numberOfUsers === 0) {
                    isAdmin = 1;
                } else {
                    isAdmin = 0;
                }
            // Requête SQL
                const sql = "\INSERT INTO Users (name, email, password, isadmin)\VALUES (?, ?, ?, ?);";
                const sqlParams = [name, email, password, isAdmin];
            // Envoi de la requete et réponse au frontend en fonction des erreurs SQL
                connection.execute(sql, sqlParams, (error, results, fields) => {
                    if (error) {
                        if (error.errno === 1062) {
                            res.status(403).json({ error: "L'email est déjà utilisé !" });
                        } else {
                            res.status(500).json({ error: error.sqlMessage });
                        }
                    } else {
                        res.status(201).json({ message: "Utilisateur créé" });
                    }
                });
                connection.end();
                }
            });
        })
        .catch((error) => res.status(500).json({ error }));
};
  
// login utilisateur
exports.login = (req, res, next) => {
    const connection = database.connect();  
    const researchedEmail = req.body.email;
    const sql =
        "SELECT id, email, password, name, pictureurl, isadmin FROM Users WHERE email= ?";
    const sqlParams = [researchedEmail];
    // requête préparée de mysql2
    connection.execute(sql, sqlParams, (error, results, fields) => {
        if (error) {
            res.status(500).json({ error: error.sqlMessage });
        } else if (results.length == 0) {
            res.status(401).json({ error: "Cet utilisateur n'existe pas" });
        } else {
            const matchingHash = cryptojs.AES.decrypt(
                results[0].password,
                process.env.CRYPT_USER_INFO
            ).toString(cryptojs.enc.Utf8);
        bcrypt.compare(req.body.password, matchingHash)
            .then((valid) => {
                if (!valid) {
                    return res.status(401).json({ error: "Mot de passe incorrect!" });
                }
            const newToken = jwt.sign(
                { userId: results[0].id },
                process.env.JWT_KEY,
                { expiresIn: "24h" }
            );
            // Envoi du token & userId dans un cookie
            const cookieContent = {
                token: newToken,
                userId: results[0].id,
            };
            const cryptedCookie = cryptojs.AES.encrypt(
                JSON.stringify(cookieContent),
                process.env.COOKIE_KEY
            ).toString();
            new Cookies(req, res).set("snToken", cryptedCookie, {
                httpOnly: true,
                maxAge: 3600000, // 1 heure
            });
  
            res.status(200).json({
                message: "Utilisateur loggé",
                userId: results[0].id,
                name: results[0].name,
                pictureUrl: results[0].pictureurl,
                isAdmin: results[0].isadmin,
            });
            })
            .catch((error) => res.status(500).json({ error }));
        }
    });
    connection.end();
};
  
// Logout d'un utilisateur
exports.logout = (req, res, next) => {
    // on remplace le cookie par un vide
    new Cookies(req, res).set("snToken", "", {
        httpOnly: true,
        maxAge: 1, // 1ms (= suppression quasi instantannée)
    });
    res.status(200).json({ message: "utilisateur déconnecté" });
};
  
// Vérification si un utilisateur est bien loggé
exports.isAuth = (req, res, next) => {
    res.status(200).json({ message: "utilisateur bien authentifié" });
};