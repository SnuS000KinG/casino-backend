const mongoose = require('mongoose');
const User = require('./User');

const TransactionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
        index: true
    },
    amount:{
        type: Number,
        required: true
    },
    type:{
        type: String,
        enum: ['DEPOSIT', 'WITHDRAWAL'],
        required: true
    },
    status:{
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'COMPLETED'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Transaction', TransactionSchema);