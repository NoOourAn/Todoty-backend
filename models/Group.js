const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupsSchema = new Schema({
    title:{
        type:String,
        maxlength:20,
        required:[true,"forgot your group title?"]
    }, 
    user:{
        index: true,
        type:Schema.Types.ObjectId, 
        ref:'User'
    }
},
{ timestamps: { updatedAt: 'modifiedAt' }}
);

const Group = mongoose.model('Group', groupsSchema);
module.exports = Group