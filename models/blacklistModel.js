const mongoose = require('mongoose');

const blackListSchema = mongoose.Schema(
  {
    wordList: {
      type: String,
      required: [true, 'Zorunlu Alan'],
      unique: [true, 'Parameter already exists'],
    },
  },
  { collection: 'blackList' }
);
const BlacklistedWord = mongoose.model('BlacklistedWord', blackListSchema);


module.exports = BlacklistedWord;
