const Group = require('../models/Group')
const mongoose = require('mongoose');
const Todo = require('../models/Todo')

////helper functions
///function to get user todos in specific month and day
async function getTodosInMonthAndDay(userId,month,day){
    let todos=[];
    todos = await Todo.aggregate([
        {
            $match: { 
                user: new mongoose.Types.ObjectId(userId) 
            }
        },
        {
            $project: {
                title:1,
                creayedAt:1,
                modifiedAt:1,
                day: {$dayOfMonth: '$createdAt'},
                month: {$month: '$createdAt'}
            }
        },
        {
            $match: {
                month: parseInt(month),
                day: parseInt(day)
            }
        }
    ]).exec();
    return todos;
}
//////function to get todos in specific month
async function getTodosInOneMonth(userId,month){
    let todos=[]
    todos = await Todo.aggregate([
        {
            $match: { 
                user: new mongoose.Types.ObjectId(userId) 
            }
        },
        {
            $project: {
                title:1,
                creayedAt:1,
                modifiedAt:1,
                month: {$month: '$createdAt'}
            }
        },
        {
            $match: {
                month: parseInt(month)
            }
        }
    ]).exec();

    return todos;
}
/////function to get todos in specific day
async function getTodosInOneDay(userId,day){
    let todos=[]
    todos = await Todo.aggregate([
        { 
            $match: { 
                user: new mongoose.Types.ObjectId(userId) 
            }
        },
        {
            $project: {
                title:1,
                creayedAt:1,
                modifiedAt:1,
                day: {$dayOfMonth: '$createdAt'}
            }
        },
        {
            $match: {
                day: parseInt(day)
            }
        }
    ]).exec();

    return todos
}

/////////function to get todos grouped by day
async function groupTodosByDay(userId){
    let todos= [];
    let temp= [];
    let groups= [];
    groups = await Todo.aggregate([
        { 
            $match: { 
                user: new mongoose.Types.ObjectId(userId) 
            }
        },
        {
            $group: {
                _id: {$dayOfMonth: "$createdAt"}, 
                TodosPerDay: {$sum: 1} 
            }
        }
    ]);
    for(let group of groups){
        
        temp = await Todo.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId) 
                }
            },
            {
                $project: {
                    title:1,
                    creayedAt:1,
                    modifiedAt:1,
                    day: {$dayOfMonth: '$createdAt'}
                }
            },
            {
                $match: {
                    day: parseInt(group._id)  ///to get the day of the current group
                }
            }
        ]).exec();
        let obj = {
            day:group._id,
            todos:temp
        }
        todos.push(obj) 
    }
    // console.log(todos)
    return todos
}
//////////function to get todos grouped by month
async function groupTodosByMonth(userId){
    let todos= [];
    let temp= [];
    let groups= [];
    groups = await Todo.aggregate([
        { 
            $match: { 
                user: new mongoose.Types.ObjectId(userId) 
            }
        },
        {
            $group: {
                _id: {$month: "$createdAt"}, 
                TodosPerMonth: {$sum: 1} 
            }
        }
    ]);
    for(let group of groups){
        
        temp = await Todo.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId) 
                }
            },
            {
                $project: {
                    title:1,
                    creayedAt:1,
                    modifiedAt:1,
                    month: {$month: '$createdAt'}
                }
            },
            {
                $match: {
                    month: parseInt(group._id)  ///to get the day of the current group
                }
            }
        ]).exec();
        let obj = {
            month:group._id,
            todos:temp
        }
        todos.push(obj) 
    }
    return todos;
}
//////////function to get todos grouped by group name
async function groupTodosByGroup(userId){
    let todos= [];
    let temp= [];
    let groups= [];
    groups = await Group.find({user:userId})
    for(let group of groups){
        
        temp = await Todo.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId),
                    group: new mongoose.Types.ObjectId(group._id) 
                }
            },
          
        ]).exec();
        let obj = {
            groupId:group._id,
            groupTitle:group.title,
            todos:temp
        }
        todos.push(obj) 
    }
    return todos;
}


module.exports = {
    getTodosInMonthAndDay, 
    getTodosInOneMonth, 
    getTodosInOneDay,
    groupTodosByDay,
    groupTodosByMonth,
    groupTodosByGroup
}