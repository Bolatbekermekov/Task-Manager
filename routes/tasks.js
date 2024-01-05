const asyncWrapper = require("../middleware/async")
const {createCustomError} = require("../middleware/error")
const Task = require("../db/schema")

const getAllTasks = asyncWrapper(async (req,res)=>{
  const all_task = await Task.find()
  res.status(200).json({all_task}) 
})
const createTask = asyncWrapper(async (req,res)=>{
    const task = await Task.create(req.body)
    res.status(200).json({task})
})

const getTask = asyncWrapper(async(req,res,next)=>{
  const {id:taskID} = req.params
  const single_task = await Task.findOne({_id:taskID})
  if(!single_task){
    return next(createCustomError(`No task with id:${taskID}`,404))
  }
  res.status(200).json({single_task})
})

const updateTask = asyncWrapper(async(req,res)=>{
  const {id:taskID} = req.params
  const update_task = await Task.findOneAndUpdate({_id:taskID},req.body,{
    new:true,
    runValidators: true
  })
  if(!update_task){
    return next(createCustomError(`No task with id:${taskID}`,404))
  }
  res.status(200).json({update_task})
})


const deleteTask = async(req,res)=>{
  try{
  const {id:taskID} = req.params
  const delete_task = await Task.findOneAndDelete({_id:taskID})
  
  if(!delete_task){
    return next(createCustomError(`No task with id:${taskID}`,404))
  }
  res.status(200).json({delete_task})
}catch (err){
  res.status(500).json({msg:err})
}
}


module.exports = {
  getAllTasks,
createTask,
getTask,
updateTask,
deleteTask}