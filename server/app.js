const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./public'))
app.use(morgan('short'))
app.use(require('./routes/books.js'))
app.use(require('./routes/users.js'))

app.listen(5000, () => {
  console.log("Server is listening on 5000...");
});

app.get("/", (req, res) => {
  console.log("Responding to root route");
  res.send("hello from  rooot");
});