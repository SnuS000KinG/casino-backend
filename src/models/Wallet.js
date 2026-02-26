const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    balance:{ 
        type: Number,
        default: 0
    },
    // currency:{
    //     type: String,
    //     default: "Zl"
    // }
});

module.exports = mongoose.model('Wallet', WalletSchema);