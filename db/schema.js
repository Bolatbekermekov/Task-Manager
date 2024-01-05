const mongoose = require('mongoose')

const TasksShema = new mongoose.Schema({
  name: {
    type:String,
    required:[true,"please provide your name"],
    trim:true,
    maxlength:[20,"no more then 20 characters"]
  },
  completed:{
    type:Boolean,
    default:false
  }
}) 

module.exports = mongoose.model("Task",TasksShema)