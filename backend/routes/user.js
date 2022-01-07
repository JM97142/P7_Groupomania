// Importation modules
const { Router } = require("express");
const express = require("express");
const router = express.Router();

// Importation controllers
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate-inputs');

// Routes
router.post('/new', validate.newUser, userCtrl.newuser);
router.post('/login', validate.login, userCtrl.login);
router.get('/logout', userCtrl.logout);
router.get('/isauth', auth, userCtrl.isAuth);
router.get('/currentuser', auth, userCtrl.getCurrentUser);
router.get('/', auth, userCtrl.getAllUsers);

module.exports = router;