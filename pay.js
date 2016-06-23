var dotenv = require("dotenv");
dotenv.load();
var express = require('express'),
    app = express(),
    config = require('./knex/knexfile.js'),
    env = process.env.NODE_ENV || 'development',
    knex = require('knex')(config[env]),
    password = process.env.password,
    username = process.env.username,
    apiCode = process.env.apiCode,
    bitreturnPayment = "1HhZVRtuTdfvfVFy5t3dGuindGUUFuRQUP",
    db = require("./knex/db")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3001,  () => {
  console.log('listening on port ', 3001);
});

function findPayees(){
  db.findAll()
  .then( (data) => {
    payout(data[0].value, data[0].address)
  })
  .catch( (err) => {
    if (err) throw err
  })
}

function payout(value,address) {
  var query = "http://localhost:3000/merchant/$guid/payment?password=$" +
  + password + "&to=$" + address + "&" +
  "amount=$" + value + "&api_code=$"+ apiCode + "&note=$" + "BitReturn tax rebate from BitReturn.com"

  request(query,(req,res) => {
    console.log("Here is the data back from the server: ", res.body)
    payFee(value * 0.005); //0.5% fee on each transaction
    // res.send(200, " Payment completed!")
    return;
  })
}

function payFee(value){
  var query = "http://localhost:3000/merchant/$guid/payment?password=$" +
  + password + "&to=$" + bitreturnPayment + "&" +
  "amount=$" + value + "&api_code=$"+ apiCode + "&note=$" + "BitReturn Fee"

  request(query,(req,res) => {
    console.log("Paid fee to BitReturn!")
    // res.send(200, " Fee Paid!")
    return;
  })
}
