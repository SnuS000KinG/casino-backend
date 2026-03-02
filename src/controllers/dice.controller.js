const User = require('../models/User');
const Wallet = require('../models/Wallet');
const mongoose = require('mongoose');

const gameDice = async (req, res) =>{
    try{
        const { bet, guessEven, guessSum, guessCombo } = req.body;
        const user = await User.findById(req.user.id);
        const wallet = await Wallet.findById(user.wallet);

        if(!user || wallet.balance < bet){
            return res.status(400).json({msg: 'nit dinig'});
        }
        const roll = Array.from({ length: 5}, () => Math.floor(Math.random()*6 )+1);

        const totalSum = roll.reduce((acc, curr)=> acc + curr, 0);
        const isEven = totalSum % 2 == 0;

        let sumComparsion = "";
        if (totalSum <= 17){
            sumComparsion = "<= 17";
        }else if (totalSum > 17){
            sumComparsion = "> 17";
        }
        const counts = {};
        roll.forEach(num=> counts[num] = (counts[num] || 0)+1);
        const maxCombo = Math.max(...Object.values(counts));

        let winAmount = 0;

        //isEven
        if(guessEven !== undefined && guessEven == isEven){
            winAmount += bet * 1.5;
        }

        //sum
        if(guessSum !== undefined && guessSum == sumComparsion){
            winAmount += bet * 1.5;
        }

        //combo 
        const combo = Number(guessCombo)
        if (!isNaN(combo) &&  [3, 4, 5].includes(combo)){
            if (maxCombo === combo){
                const comboMultipliers = {
                3: 3,
                4: 5,
                5: 10
                };
                winAmount += bet* comboMultipliers[combo];
            }
        }
        
        //obnowliajem balance
       wallet.balance = wallet.balance - bet + winAmount;
        await user.save();
        // wallet.balance = wallet.balance - bet + winAmount;
        await wallet.save();

        res.status(200).json({
            roll,
            totalSum,
            isEven,
            sumComparsion,
            maxCombo,
            winAmount,
            newBalance: wallet.balance
        });

    }catch(error){
        console.error(error);
        res.status(500).json({msg: 'server error'});
    }
};
module.exports = {
    gameDice
};