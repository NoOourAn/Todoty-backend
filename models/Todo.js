const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todosSchema = new Schema({
    title:{
        type:String,
        maxlength:20,
        required:[true,"forgot your todo title?"]
    },
    body:{
        type:String,
        maxlength:200,
        required:[true,"forgot your todo body?"]
    },
    status:{
        type:Boolean,
        default:false,
    },
    user:{
        index: true,
        type:Schema.Types.ObjectId, 
        ref:'User'
        
    },
    group:{
        index: true,
        type:Schema.Types.ObjectId, 
        ref:'Group'
    }

},
{ timestamps: { updatedAt: 'modifiedAt' }}
);

const Todo = mongoose.model('Todo', todosSchema);
module.exports = Todo