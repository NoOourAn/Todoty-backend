const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    username: { 
        type: String ,
        required:[true,"we need username to welcome You Dear ?"], 
        unique: true,
        index: true ,
        minlength:3,
        maxlength:15
    }, 
    email: { 
        type: String,
        required:[true,"what about the email ?!"], 
        unique: true,
        index: true,
        validate: {
            validator: function(email) {
                var emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*")
                return emailRegex.test(email)
            },
            message: "Are U trying to fool us with fake email ?"
          },
    },
    password: { 
        type: String,
        required:[true,"you r strong , you need a strong password as well !"]
    },  
    loggedIn: {
        type:Boolean, 
        default:false
    },
},
{ timestamps: { updatedAt: 'modifiedAt' }}  ///schema options
);


const User = mongoose.model('User', usersSchema);
module.exports = User