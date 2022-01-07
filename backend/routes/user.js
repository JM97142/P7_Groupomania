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
router.get('/search', auth, validate.searchUser, userCtrl.searchUsers);
router.get('/:id', auth, validate.id, userCtrl.getOneUser);
router.get('/:id/posts', auth, validate.id, userCtrl.getAllPostsOfUser);
router.put('/:id/password', auth, validate.id, validate.changePassword, userCtrl.changePassword);
router.put('/:id/picture', auth, validate.id, multer, userCtrl.changeProfilePicture);
router.put('/:id/outline', auth, validate.id, validate.outline, userCtrl.changeOutline);
router.put('/:id/admin', auth, validate.id, validate.adminCredential, userCtrl.changeAdmin);
router.delete('/:id', auth, validate.id, userCtrl.deleteAccount);

module.exports = router;