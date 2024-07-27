const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Users = require('../controllers/users');


router.route('/register')
    .get(Users.renderRegister)
    .post(catchAsync(Users.register));

 router.route('/login')
    .get(Users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), Users.login)



// router.get('/register', Users.renderRegister);

// router.post('/register', catchAsync(Users.register));

// router.get('/login', Users.renderLogin)

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), Users.login)

router.get('/logout', Users.logout);
// router.get('/logout', users.logout)

module.exports = router;