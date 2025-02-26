const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
    wordsPerMinute: {
        type: Number,
        required: true,
    },
    accuracy: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    belongsTo: {
        type: mongoose.Types.ObjectId,
        required: true,
    }
});

module.exports = mongoose.model('Test', testSchema);