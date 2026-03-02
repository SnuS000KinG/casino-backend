const express = require('express');
const router = express.Router();
const diceController = require('../controllers/dice.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post(
    '/',
    authMiddleware,
    diceController.gameDice
);

module.exports = (router);