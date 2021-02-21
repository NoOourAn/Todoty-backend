const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const sendConfirmationMail = require('../send-email');

///to get the registeration form 
router.get(['/','/register'], (req, res) => {
    res.render('register')
  })
  
//to post the reg. form values
router.post('/register', async (req, res) => {
    ///the api handling
    try{
        const {username ,email ,password} = req.body;
        if(username && email && password){  ///just in case the 'required' validation in frontend is ruined for some reason
            ///to check if username and email unique
            const FoundUser = await User.findOne({$or:[{username},{email}]}).exec();
            if(FoundUser) throw new Error("username or email already exists")
    
            ///to check if password is strong enough
            var Passwordregex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}");
            let strongPassword = Passwordregex.test(password);
            if(!strongPassword) throw new Error("your password should contain Atleast 1 capital letter , 1 digit in minimum 8 long")
            ///after all validations are passed
            const HashedPassword = await bcrypt.hash(password, 10);
            await User.create({ username,email,password:HashedPassword})
            ////send confirmation mail to the user
            sendConfirmationMail(email,username);
            ///send response 
            res.json({success:true,message:"You Registered Successfully..."}) ///head to the same page with success msg 

        }else throw new Error("username, email and password are required")
    }catch(err){
        res.json({success:false,message:err.message}) ///head to the same page with error msg
    }
})
    
///to get the login form 
router.get('/login', (req, res) => {
    res.render('login')
})
  
//to post the login form values
router.post('/login', async (req, res) => {
    ///the api handling
    try{
        const {username,password} = req.body;
        if(username && password){
  
            const user  = await User.findOne({ username }).exec(); 
            if(!user) throw new Error("wrong username or password!!")
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) throw new Error("wrong username or password!!");
    
            //prepare token for user
            var token = await jwt.sign({ id: user.id }, 'Awesomeness');
            const obj = {
                success:true,
                message: "logged in successfully",
                token:token
              }
              res.json(obj)
        }else throw new Error("username and password are required")
  
      }catch(err){
          res.json({success:false,message:err.message})
      }
})







module.exports = router