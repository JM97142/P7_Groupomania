// Importation des modules
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/user");

const database = require("./utils/database");

// Application
const app = express();

// CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json());
app.use(helmet());

// Connexion base de données
database.connect();
console.log("Connexion à MySQL réussie !");

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("api/user", userRoutes);

module.exports = app;