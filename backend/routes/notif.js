// Importaion modules
const express = require("express");
const router = express.Router();

// Controllers
const notifCtrl = require("../controllers/notif");

// Middlewares
const auth = require("../middleware/auth");

// Routes
router.get('/', auth, notifCtrl.getNotifs);

module.exports = router;