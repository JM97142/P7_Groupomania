// Importation des modules
const express = require("express");
const router = express.Router();

// Controllers
const postCtrl = require("../controllers/post");

// Middlewares
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate-inputs");
const multer = require("../middlewares/multer-config");
const credential = require("../middlewares/credential");

// Routes
router.post('/', auth, multer, validate.postContent, postCtrl.newPost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, validate.id, postCtrl.getOnePost);
router.get('/:limit/:offset', auth, validate.getSomePosts, postCtrl.getSomePosts);
router.delete('/:id', auth, validate.id, credential.deletePost, postCtrl.deletePost);

module.exports = router;