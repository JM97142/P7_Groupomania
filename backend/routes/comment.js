// Modules
const express = require('express');
const router = express.Router();

// Controllers
const commentCtrl = require('../controllers/comment');

// Middlewares
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate-inputs');
const credential = require('../middlewares/credential')


router.post('/', auth, validate.comment, commentCtrl.newComment);

module.exports = router;