const express = require('express');
const blacklistController = require('./../controllers/blacklistedController');

const router = express.Router();

router.route('/getAllBlackList').get(
    blacklistController.getAllBlacklistedWords);

router.post('/createBlackList',blacklistController.createBlacklistedWord)    
    

module.exports = router;