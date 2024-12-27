const BlacklistedWord = require('../models/blacklistModel');

exports.getAllBlacklistedWords = async (req, res) => {
    try {
        const blacklistedWords = await BlacklistedWord.find();
        res.status(201).json({
            status: 'success',
            data: {
                blacklistedWords: blacklistedWords,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'failed to get All blacklisted words',
            err,
        });
        console.log(err);
    }
};

exports.createBlacklistedWord = async (req, res) => {
    try {
        const newBlacklistedWord = await BlacklistedWord.create(req.body);
        // console.log(newBlacklistedWord);
        
        res.status(201).json({
            status: 'success',
            data: {
                blacklistedWord: newBlacklistedWord,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'failed to create blacklisted word',
            err,
        });
        console.log(err);
    }
};