// Modules
const express = require('express');
const router = express.Router();

// Controllers
const commentCtrl = require('../controllers/comment');

// Middlewares
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate-inputs');
const credential = require('../middlewares/credential')

// Routes
router.post('/', auth, validate.comment, commentCtrl.newComment);
router.get('/', auth, validate.postId, commentCtrl.getCommentsofPost);
router.delete('/:id', auth, validate.id, credential.deleteComment, commentCtrl.deleteComment);

module.exports = router;