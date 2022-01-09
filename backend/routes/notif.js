// Importaion modules
const express = require("express");
const router = express.Router();

// Controllers
const notifCtrl = require("../controllers/notif");

// Middlewares
const auth = require("../middleware/auth");
const validate = require("../middleware/validate-input");
const credential = require("../middleware/credential");

// Routes
router.get('/', auth, notifCtrl.getNotifs);
router.delete('/', auth, notifCtrl.deleteAllNotifs);
router.delete('/:id', auth, validate.id, credential.deleteNotification, notifCtrl.deleteOneNotif);
module.exports = router;