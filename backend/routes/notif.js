// Modules
const express = require("express");
const router = express.Router();

// Controllers
const notifCtrl = require("../controllers/notif");

// Middlewares
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate-inputs");
const credential = require("../middlewares/credential");

// Routes
router.get('/', auth, notifCtrl.getNotifs);
router.delete('/', auth, notifCtrl.deleteAllNotifs);
router.delete('/:id', auth, validate.id, credential.deleteNotification, notifCtrl.deleteOneNotif);

module.exports = router;