const User = require('../models/User'); 
const register = async (req, res) => {
    const { nickname, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        return res.status(400).json({ msg: ('error 400') });
    }
    
    const user = new User({
        nickname, 
        email: email.toLowerCase(),
        password,
    });
    await user.save();


    res.status(201).json({ msg: ('user created') });
};

module.exports = {register}