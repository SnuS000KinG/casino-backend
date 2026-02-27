const User = require('../models/User');
const Wallet = require('../models/Wallet');
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
        res.json({msg: 'oparation successful', 
        balance: updatedWallet.balance});
    }catch(error){
        console.error(error);
        res.status(500).json({msg: 'server error'});
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    TopUpBalance
};