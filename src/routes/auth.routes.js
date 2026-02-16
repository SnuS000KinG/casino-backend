const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controler');
router.post(
    '/register',
  
    authController.register
);
module.exports = (router);