const express = require('express');
const router = express.Router()
const Todo = require('../models/Todo')
const helper = require('./helper')


///api to create new todo
router.post('/',async (req,res)=>{
    try {
        const {title,body,group} = req.body
        const userId = req.decodeData.id;
        if(title && body){
            let todo;

            if(group && group !== 'null')
                todo = await Todo.create({title,body,group,user:userId})
            else
                todo = await Todo.create({title,body,user:userId})

            const obj = {
                success:true,
                message:"todo was created succesfully",
                todo: todo
            }
            res.send(obj)
        }else throw new Error("title and body are required")
    } catch (err) {
        res.json({success:false,message:err.message})
    }

})

///api to get all Todos ///api to get todos of specific month or day(filters)
router.get('/',async (req, res) => {
    try {
        const {month,day,groupBy} = req.query;
        const userId = req.decodeData.id;
        let todos=[];
        ////to check filters (query parameters)
        if(month && day)
            todos = await helper.getTodosInMonthAndDay(userId,month,day)

        else if(month)
            todos = await helper.getTodosInOneMonth(userId,month)
    
        else if(day)
            todos = await helper.getTodosInOneDay(userId,day)
            
        else if(groupBy=='day')
            todos = await helper.groupTodosByDay(userId)
        
        else if(groupBy=='month')
            todos = await helper.groupTodosByMonth(userId)

        else if(groupBy=='group')
            todos = await helper.groupTodosByGroup(userId)

        else
            todos = await Todo.find({user:userId})
            
        ///create the obj of todos according to query string values
        const obj ={
            success:true,
            todos: (todos.length? todos : []) ///if no todos return empty list
        }
        res.send(obj)
    } catch (err) {
        res.json({success:false,message:err.message})
    }
})


 ///MANIPULATE Todo with ID
 router.route('/:id')
 .get(async (req,res)=>{  ///to get todo with id
    try {
        const {id} = req.params;
        const userId = req.decodeData.id;
        const todo = await Todo.findOne({ _id: id ,user: userId})
        const obj = {
            success:true,
            todo:(todo)? todo: "todo not found",
        }
        res.send(obj);
    } catch (error) {
        res.json({success:false,message:err.message})
    }
 })
 .delete(async(req, res) => {  ///delete todo
    try {
        const {id} = req.params;
        const userId = req.decodeData.id;
        const todo = await Todo.findOneAndDelete({_id:id,user: userId})
        const obj = {
            success:true,
            message:(todo)? "todo deleted successfully": "todo not found"
        }
        res.send(obj)
    } catch (err) {
        res.json({success:false,message:err.message})
    } 
 })
 .patch(async(req, res) => {  ///edit todo
    try {
        const {id} = req.params;
        const {title,body,group} = req.body;
        const userId = req.decodeData.id;
        const todo = await Todo.findOneAndUpdate({ _id: id ,user: userId}, {title,body,group},{returnOriginal: false})
        const obj = {
            success:true,
            message:(todo)? "todo edited successfully": "todo not found",
            todo:todo
        }
        res.send(obj);
    } catch (err) {
        res.json({success:false,message:err.message})
    }      
 })
  

/////change todo status (if false: to true // if true: to false)
router.patch('/status/:id',async(req,res)=>{
    try {
        const {id} = req.params;
        const userId = req.decodeData.id;
        let todo = await Todo.findOne({ _id: id ,user: userId})
        todo = await Todo.findOneAndUpdate({ _id: id ,user: userId}, {status:!todo.status},{returnOriginal: false})
        const obj = {
            success:true,
            message:(todo)? "todo status changed successfully": "todo not found",
            todo:todo
        }
        res.send(obj);
    } catch (err) {
        res.json({success:false,message:err.message})
    }
 });




module.exports = router