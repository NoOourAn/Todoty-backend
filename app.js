const express = require('express')
const usersRoutes = require('./routes/users')
const todosRoutes = require('./routes/todos')
const errorRoute = require('./routes/error')
const groupsRoutes = require('./routes/groups')
const authMiddleware = require('./middlewares/authMW')
require('./db-conn')
const cors = require('cors'); 

const app = express()
app.use(cors())
const port = 3000

//set up template engine
app.set('view engine','ejs')

//set up static files
app.use(express.static('public'))  ///by default it heads for public folder

//set up json body parser
app.use(express.json());

//Users Router
app.use('/api/users',usersRoutes)

//Todos Router
app.use('/api/todos',authMiddleware,todosRoutes)  

//Groups Router
app.use('/api/groups',authMiddleware,groupsRoutes)  

 
//error route
app.use('**', errorRoute)




app.listen(port,()=>{
    console.log(`i am listening on port ${port}`)
})