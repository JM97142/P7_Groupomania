// Importation modules
const { Router } = require("express");
const express = require("express");
const router = express.Router();

// Importation controllers
const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/user');

router.post('/new', validate.newUser, userCtrl.newuser);
router.post('/login', validate.login, userCtrl.login);
router.get('/logout', userCtrl.logout);
router.get('/isauth', auth, userCtrl.isAuth);

module.exports = router;