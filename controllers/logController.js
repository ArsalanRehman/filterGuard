const LogModel = require('../models/logModel');
const UserModel = require('../models/userModels');
const Joi = require('joi');
exports.getAllLogs = async (req, res) => {
    try {
        const log = await LogModel.find();
        res.status(200).json({
            status: 'success',
            data: {
                log,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.createLog = async (req, res) => {
    const logSchema = Joi.object({
        url: Joi.string().uri().required(),
        censorStatus: Joi.string().valid('Censored', 'Not Censored').required(),
        userId: Joi.string().required(), // Accept userId in the request body
    });

    const { error } = logSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.details[0].message,
        });
    }

    const { url, censorStatus, userId } = req.body;

    try {
        // Retrieve user information from the database using the userId
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found',
            });
        }

        const username = user.name;     
        const timestamp = new Date().toISOString();

        // Create log entry
        const log = await LogModel.create({
            url,
            censorStatus,
            timestamp,
            username,
        });

        res.status(200).json({
            status: 'success',
            data: {
                log,
            },
        });
    } catch (err) {
        console.error('Error creating log:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};

exports.deleteLog = async (req, res) => {
    try {
        const log = await LogModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                log,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};
