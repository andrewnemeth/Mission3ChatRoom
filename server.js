var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var fs = require('fs')

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var data = {}

app.get('/messages', (req, res) => {
    res.send(data);
})

app.post('/messages', async (req, res) => {
  try{
    newMessage = req.body;
    newMessage["id"] = data.nextID;
      let date = new Date();
      newMessage["time"] = date.getTime();
    data.nextID++;
    data.messages.push(newMessage)
      fs.writeFile('messages.json',JSON.stringify(data),(err) => {
          if (err) throw err;
          console.log('saved');
      })
      io.emit('message', req.body);
      res.sendStatus(200);
      console.log("Sent")

  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }

})

io.on('connection', () =>{
  console.log('new user connected')
})


var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
    var file = fs.readFileSync('messages.json')
    data = JSON.parse(file);
    console.log(data)
});
