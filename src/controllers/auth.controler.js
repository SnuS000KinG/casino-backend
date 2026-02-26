const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { randomBytes, randomUUID } = require('crypto'); 
const User = require('../models/User'); 

//generacja tokenu
const generateAccessToken = (id, roles, sessionTokenVersion)=>{
    const payload = {id, roles, sessionTokenVersion, ver: 2};
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h'});
};

const register = async (req, res) => {
    const { nickname, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        return res.status(400).json({ msg: ('error 400') });
    }

    const verificationToken = randomUUID();
    const user = new User({
        nickname, 
        email: email.toLowerCase(),
        password,
        roles: ['ADMIN', 'USER'],
        verificationToken
    });
    await user.save();


    res.status(201).json({ msg: ('user created') });
};

//logowanie usera // вход в систему 
const login = async (req, res) => {
        const { email, password } = req.body;

    const user = await User.findOne({email: email.toLowerCase()});
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(400);
    // if(!user || !(await user.comparePassward(password))) {
    //     return res.status(400).json({msg: 'error400'});
    // }

    if (!user.emailVerified){
        return res.status(400).json({msg: 'error401'});
    }

    user.sessionTokenVersion +=1;  // обновление версии токена пользователя
    await user.save();

    const token = generateAccessToken(user._id, user.roles, user.sessionTokenVersion); //сохдание нового токена

    res.status(200).json({
        token,
        user:{
            id: user._id, // Внутренний ID для приватных запросов
            // uuid: user.uuid, // public id dla url
            roles: user.roles,
        }
    })
    
    
};

// verefikacja email po tokenu z pisma
const verifyEmail = async (req, res)=>{
    const{ token } = req.query;

    const user = await User.findOne({ VerificationToken: token});
    if(!User){
        return res.status(400).json({ msg: 'error403'});
    }

    user.emailVerified = true;
    user.VerificationToken = undefined;
    await user.save();

    res.json({msg: 'email verifyed'});
};

module.exports = {
    register,
    login,
    verifyEmail
}
