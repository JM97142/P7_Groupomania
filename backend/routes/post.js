// Importation des modules
const express = require('express');
const router = express.Router();

// Importation controllers
const postCtrl = require('../controllers/post');

// Middlewares
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate-inputs');
const multer = require('../middlewares/multer-config');

// Routes
router.post('/', auth, multer, validate.postContent, postCtrl.newPost);

module.exports = router;