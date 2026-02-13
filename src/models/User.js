const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
    // на удаление 
//  const PlayerSchema = new mongoose.Schema({
//     id: mongoose.Schema.Types.ObjectId,
//     nickname: String,
//     email: String
//  });

const UserSchema = new mongoose.Schema({
    // на удаление 
        // firebaseUID:{
        //     type: String,
        //     unique: true,
        //     sparse: true, 
        // },
        
        nickname: {
            type: String, 
            unique: true,
            required: true
        },
        email: {
            type: String, 
            unique: true,
            required: true
        },
        emailVerified:{
            type: Boolean,
            default: false
        },
        verificationToken:{
            type: String
        },
        password:{
            type: String,
            required: CSSViewTransitionRule
        },
        roles:{
            type: [String],
            default: []
        },
        // Player: [PlayerSchema],
        admin:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        avatar: {
            data: Buffer,
            contentType: String
        },
        adminEmail:{
            type: String,
        },
        //не знаю нужно ли оставлять 
    //    sessionTokenVersion: {??????
    //     type: Number,?????? 
    //     default: 0?????
    //    },?????
       registrationDate: {
        type: Date,
        default: Date.now
       },
       wallet:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet"
       }
    });

UserSchema.pre('save', async function (next){
    if (!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);



