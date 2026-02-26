const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controler');

//router registracji
router.post(
    '/register',
    [ 
        check('nickname', 'Last name is required').not().isEmpty().trim(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
    ],
    authController.register
);

//router loginu
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    authController.login
);

//email verification // верефикация емаийла по токену из письма 
router.get(
    '/verify-Email',
    [
        authController.verifyEmail// проверка токена в контролере из req.query
    ],
)

module.exports = (router);