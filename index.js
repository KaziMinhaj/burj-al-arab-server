const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors()) //cross origin resouce access permission 
app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://arabian:7GtbZZktygOziliw@cluster0.fzhcz.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookings = client.db("burjAlArab").collection("bookings");
  console.log("DB error",err);
    //methods
    app.post('/addBooking',(req,res)=>{
        const newData = req.body
        bookings.insertOne(newData)
        .then(result =>{
            res.send(result.insertedCount>0);
        })
        console.log("line 23:", newData);
    })
    app.get('/bookings',(req,res)=>{
        bookings.find({email: req.query.email})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})