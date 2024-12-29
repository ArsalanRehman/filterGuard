const mongoose = require('mongoose');


const logSchema = new mongoose.Schema({
    url: String,
    username: String,
    censorStatus: String,
    timestamp: Date,
  });
  
const VisitLog = mongoose.model('Log', logSchema);

module.exports = VisitLog;