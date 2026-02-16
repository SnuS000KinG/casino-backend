const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({ 
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
        // emailVerified:{
        //     type: Boolean,
        //     default: false
        // },
        // verificationToken:{
        //     type: String
        // },
        password:{
            type: String,
            // required: CSSViewTransitionRule
        },
        // roles:{
        //     type: [String],
        //     default: []
        // },
        // avatar: {
        //     data: Buffer,
        //     contentType: String
        // },
    //    sessionTokenVersion: {
    //     type: Number,
    //     default: 0
    //    },
    //    registrationDate: {
    //     type: Date,
    //     default: Date.now
    //    },
    //    wallet:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Wallet"
    //    }
    });

// UserSchema.pre('save', async function (next){
//     if (!this.isModified('password')){
//         return next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// UserSchema.methods.comparePassword = async function (password){
//     return await bcrypt.compare(password, this.password);
// };

module.exports = mongoose.model('User', UserSchema);



