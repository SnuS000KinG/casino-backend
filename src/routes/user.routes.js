const express = require('express');
const router = express.Router();
// const {getMyProfile, updateMyProfile} = require('../controllers/user.controller');
const userController = require('../controllers/user.controller');

const authMiddleware = require('../middleware/auth.middleware');


router.get(
    '/me',
    authMiddleware,
    userController.getMyProfile
);

router.put(
    '/me',
    authMiddleware,
    userController.updateMyProfile
);

router.post(
    '/topUp',
    authMiddleware,
    userController.TopUpBalance
)

module.exports = (router);