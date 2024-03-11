//import * as fs from 'fs'
//import * as express from "express"
const express = require("express")
const fs = require("fs")
const cors = require("cors")

const app = express()

const port = process.env.PORT || 3000


app.use(express.json())
app.use(cors())

app.listen(
  port,
  () => console.log(`it's alive on http://localhost:${port}`)
)

app.get("/", (req, res) => {
  res.status(200).send("haiiiii")
})

app.get("/pullJSON", (req, res) => {

  //res.send("I am here, and alive")

  console.log("I AM HERE, YOU MUST BELIEVE ME")
  data = fs.readFileSync("comments.json")
  console.log(data)
  words = JSON.parse(data)
  console.log(words)

  res.status(200).send(JSON.stringify(words))
  //

  
})

app.post("/send", (req, res) =>{
  res.status(200);
  console.log(req.body)
  fs.writeFile('comments.json', JSON.stringify(req.body), function(err){
    if (err) throw err;
    console.log('Replaced!');
  })

})

