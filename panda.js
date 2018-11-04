var app = require('express')();
const express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const _=require('underscore')
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(express.static('public'))
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/', function(req, res){
req.session.username=""
res.render('index',{"username":req.session.username})
//   res.sendFile(__dirname + '/index.html');


});
// app.get('/login', function(req, res){
// if(req.session.username){
//  res.redirect(`/`);
//     }else{

//   res.sendFile(__dirname + '/login.html');
//     }
// //   res.sendFile(__dirname + '/login.html');
// });
app.post('/logins', function(req, res){
    req.session.username=req.body.username
    res.send("sukses")
// res.json(req.body.hoho)
// res.redirect(`/`);
//   res.sendFile(__dirname + '/login.html');
});
// app.get('/logout',(req,res)=>{
//     req.session.destroy();
// })
var jumlah=[];

io.on('connection', function(socket){

    socket.on("add user",(msg)=>{

        var data=typeof msg=="string"?JSON.parse(msg):msg

jumlah.push({socket:socket,username:data.username})
        io.emit('add user', {jumlah:jumlah.length,username:data.username});
    })
     socket.on('disconnect', function() {
      console.log('Got disconnect!');
// console.log

index = jumlah.findIndex(x => x.socket==socket);

if(index>-1){
io.emit("remove user",{username:jumlah[index].username,jumlah:jumlah.length-1})
jumlah.splice(index, 1);

}


   });
   socket.on('chat message', function(msg){
    // console.log(msg);
var data=typeof msg=="string"?JSON.parse(msg):msg;
  _.mixin({
    isBlank: function(string) {
      return (_.isUndefined(string) || _.isNull(string) || string.trim().length === 0)
    }
  });
  if(!_(data.message).isBlank()){
     io.emit('chat message', data);
  }

  });
//   socket.on('keypress', function(msg){
//     // console.log(msg);

//      io.emit('keypress', typeof msg=="string"?JSON.parse(msg):msg);
//   });
});

http.listen(process.env.PORT || 3000, function(){
  console.log(`lucu on ${process.env.PORT}`);
});