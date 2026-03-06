const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');



/**
 * @desc    Получение профиля текущего пользователя
 * @route   GET /api/users/me
 * @access  Private
 */

const getMyProfile = async (req, res)=>{
    const user = await User.findById(req.user.id).select('-password').populate('wallet');
    if(!user){
        return res.status(404).json({msg: 'User not found'});
    }
    const userResponse = user.toObject();
    delete userResponse.__v;
    res.json(userResponse);
};
/**
 * @desc    Обновление базовых данных профиля (nickname, смена пароля)
 * @route   PUT /api/users/me
 * @access  Private
 */

const updateMyProfile = async(req, res)=>{
    const {nickname, currentPassword, newPassword} = req.body;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if(!user){
         return res.status(404).json({msg: 'User not found'});
    }

    if(nickname) user.nickname = nickname;

    if(newPassword) {
        if(!currentPassword){
            return res.status(404).json({ msg: 'error :(' });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if(!isMatch){
            return res.status(404).json({ msg: 'error :(' });
        }
        user.password = newPassword;
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
        msg: 'your profile has been update',
        user: userResponse
    });
};

/**
 * @desc    пополнение баланса (обновление кошелька)
 * @route   POST /api/users/topUp
 * @access  Private
 */

const TopUpBalance = async (req, res) =>{
    try{
        const {amount} = req.body;
        if(!amount || amount <= 0 ) {
            return res.status(404).json({msg: 'Invalid amount'});
        }
        const user = await User.findById(req.user.id);
        if(!user || !user.wallet){
            return res.status(404).json({msg: 'error :('});
        }
        const updatedWallet = await Wallet.findByIdAndUpdate(
            user.wallet,
            {$inc: {balance: amount}},
            {new: true}
        );
//нужно сделаьб что бы база записывало либо две либо ни одну
        const transaction = await Transaction.create({
            userId: user._id,
            amount: amount,
            type: 'DEPOSIT',
            status: 'COMPLETED'
        });

        res.json({msg: 'oparation successful', 
        balance: updatedWallet.balance,
        transaction
        });
    }catch(error){
        console.error(error);
        res.status(500).json({msg: 'server error'});
    }
};

/**
 * @desc    вывод средств (обновление кошелька)
 * @route   PUT /api/users/withdrwal
 * @access  Private
 */

const withdrawalFunds = async (req, res)=>{
    try{
        const{ amount } = req.body;
        const user = await User.findById(req.user.id);
        const wallet = await Wallet.findById(user.wallet);
         
        if(!user || !user.wallet){
            return res.status(404).json({msg: 'error :('});
        }
        if(!amount || amount <= 0 ) {
            return res.status(404).json({msg: 'Invalid amount'});
        }
        if(!wallet || amount > wallet.balance){
            return res.status(400).json({msg: 'there is not enough money on the balance'});
        }

        wallet.balance -= amount;
        await wallet.save();

        const transaction = await Transaction.create({
            userId: user._id,
            amount: amount,
            type: 'WITHDRAWAL',
            status: 'COMPLETED'
        });
        res.json({
            msg: 'oparation successful',
            balance: wallet.balance,
            transaction
        })      
    }catch(error){
        console.error(error);
        res.status(500).json({msg: 'server error'});
    }
};

/**
 * @desc    получение листа операций по id usera
 * @route   PUT /api/users/history
 * @access  Private
 */
    const getMyHistory  = async (req, res)=>{
        try{
           const user = await User.findById(req.user.id);
            const transaction = await Transaction.find(user.transaction)
            .sort({createdAt:-1})
            .limit(20);

            const history = transaction.map(t => {
                return{
                    id: t._id,
                    // date: new Date(t.createdAt).toLocaleDateString('pl-PL'), //если отдельно нужна будет дата
                    time: new Date(t.createdAt).toLocaleDateString('pl-PL', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),

                    amount: t.type === 'WITHDRAWAL' ? -t.amount : t.amount,
                    type: t.type,
                    status: t.status,
                    description: t.type === 'DEPOSIT' ? 'top up balance' : 'withdrawal of funds'
                };
            });

            res.json(history);
        }catch(error){
            console.error(error);
            res.status(500).json({msg: 'server error'});
        }
    };

    

module.exports = {
    getMyProfile,
    updateMyProfile,
    TopUpBalance,
    withdrawalFunds,
    getMyHistory
};