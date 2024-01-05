const express = require('express')
const router = require('./routes/routes')
const app = express()
const connectDb = require('.//db/connect')
const errorHandler = require("./middleware/error-handler")

require("dotenv").config()
app.use(express.json())
app.use(express.static("./public"))
app.use("/api/people",router)
app.use(errorHandler)

const start = async ()=>{
  await connectDb(process.env.MONGO_URI)
  const port = 3000
  app.listen(port,(req,res)=>console.log(`app working on ${port}`))
}

start()