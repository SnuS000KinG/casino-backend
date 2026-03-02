const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const diceRoutes = require('./dice.routes');
const moreless = require('./moreless.routes');



router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/dice', diceRoutes);
router.use('/moreLess', moreless);

module.exports = (router);