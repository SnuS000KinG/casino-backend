const User = require('../models/User');
const Wallet = require('../models/Wallet');
const mongoose = require('mongoose');


const gameMoreLess = async (req, res) =>{
    try{
        const {bet, diceBid} = req.body;
        const user = await User.findById(req.user.id);
        const wallet = await Wallet.findById(user.wallet);

        if(!user ){
            return res.status(400).json({msg: 'error :('});
        }
        if(wallet.balance < bet){
            return res.status(400).json({msg: 'not rnough money'});
        }
        const roll = Array.from({length: 2}, () => Math.floor(Math.random() * 6) + 1);
        const totalSum = roll.reduce((acc, curr) => acc + curr, 0);

        let diceSum = "";
        if (totalSum < 7){
            diceSum = "2-6";
        }else if(totalSum == 7){
            diceSum = "7";
        }else if(totalSum > 7){
            diceSum = "8-12";
        }

        let winAmount = 0;

        if(diceBid !== undefined && diceBid == diceSum && diceBid == "2-6"){
            winAmount += bet * 2.7
        }else if(diceBid !== undefined && diceBid == diceSum && diceBid == "7"){
            winAmount += bet * 5
        }else if(diceBid !== undefined && diceBid == diceSum && diceBid == "8-12"){
            winAmount += bet * 2.7
        }

        wallet.balance = wallet.balance - bet + winAmount;
        await user.save();
        await wallet.save();

        res.status(200).json({
            roll, 
            totalSum,
            winAmount,
            newBalance: wallet.balance
        });
    }catch(error){
        console.error(error);
        res.status(500).json({msg: 'server error'});
    }
};
 module.exports = {
    gameMoreLess      
};