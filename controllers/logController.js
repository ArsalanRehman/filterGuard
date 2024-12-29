const LogModel = require('../models/logModel');
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
    });

    const { error } = logSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.details[0].message,
        });
    }

    const { url, censorStatus } = req.body;

    try {
        // Ensure user info is available
        if (!req.user || !req.user.name) {
            return res.status(403).json({
                status: 'fail',
                message: 'Unauthorized: User information missing',
            });
        }

        const userName = req.user.name;
        const timestamp = new Date().toISOString();

        // Create log entry
        const log = await LogModel.create({
            url,
            censorStatus,
            timestamp,
            userName,
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
