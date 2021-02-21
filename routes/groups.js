const express = require('express');
const router = express.Router()
const User = require('../models/User')
const Todo = require('../models/Todo')
const Group = require('../models/Group')


///api to create new group
router.post('/',async (req,res)=>{
    try {
        const {title} = req.body
        const userId = req.decodeData.id;
        if(title){
            const group = await Group.create({title,user:userId})
            const obj = {
                success:true,
                message:"group was created succesfully",
                group: group
            }
            res.send(obj)
        }else throw new Error("title is required")
    } catch (err) {
        res.json({success:false,message:err.message})
    }
})

///api to get all groups 
router.get('/',async (req, res) => {
    try {
        const userId = req.decodeData.id;
        const groups = await Group.find({user:userId})
        const obj ={
            success:true,
            groups: (groups.length? groups : []) ///if no todos return empty list
        }
        res.send(obj)
    } catch (err) {
        res.json({success:false,message:err.message})
    }
})


//  ///MANIPULATE Group with ID
 router.route('/:id')
 .delete(async(req, res) => {  ///delete group
    try {
        const {id} = req.params;
        const userId = req.decodeData.id;
        const todos = await Todo.deleteMany({group:id,user:userId})
        const group = await Group.findOneAndDelete({_id:id,user: userId})
        const obj = {
            success:true,
            message:(todos && group)? "group and related todos deleted successfully": "group not found"
        }
        res.send(obj)
    } catch (err) {
        res.json({success:false,message:err.message})
    } 
 })


  




module.exports = router