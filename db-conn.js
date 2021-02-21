const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/TodoApp',
                {useNewUrlParser: true, 
                 useUnifiedTopology: true , 
                 useFindAndModify:false,
                 useCreateIndex: true});



const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', ()=> {
console.log("Database connected!")

});