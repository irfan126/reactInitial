const express = require('express');
const User = require('../controllers/user');
const router = express.Router();

router.get('/:id', User.authMiddleware, User.getUser);

router.post('/auth', User.auth);

router.post('/register', User.register);

router.post('/activateAccReset', User.activateAccReset);

router.post('/activateAcc', User.activateAcc);

router.post('/passwordReset', User.passwordReset);

router.post('/resetPassword', User.resetPassword);

router.post('/updatePassword', User.updatePassword);

module.exports = router;


