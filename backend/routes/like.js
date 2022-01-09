// Importation des modules
const express = require("express");
const router = express.Router();

// Controllers
const likeCtrl = require("../controllers/like");

// Middlewares
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate-inputs");

// Routes
router.post('/', auth, validate.like, likeCtrl.rate);
router.get('/', auth, validate.postId, likeCtrl.getLikesOfPost);

module.exports = router;