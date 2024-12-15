const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/validate', AuthController.validate);
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

module.exports = router;