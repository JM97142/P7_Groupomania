// Importation modules
const { Router } = require("express");
const express = require("express");
const router = express.Router();

// Importation controllers
const userCtrl = require("../controllers/user");

// Routes
router.post('/new', userCtrl.newuser);
router.post('/login', userCtrl.login);

module.exports = router;