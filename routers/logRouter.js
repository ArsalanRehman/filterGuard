const express = require('express');
const logController = require('./../controllers/logController');
const authController = require('./../controllers/authController');
const router = express.Router();



router.get('/getAllLogs',logController.getAllLogs)  
router.post('/createLog', authController.protect, logController.createLog)
router.delete('/deleteLog/:id',logController.deleteLog)  

module.exports = router;