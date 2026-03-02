const express = require('express');
const router = express.Router();
const moreLessController = require('../controllers/moreless.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post(
    '/',
    authMiddleware,
    moreLessController.gameMoreLess
);

module.exports = (router);