var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/', function(req, res){
    if(!req.session.username){
 res.redirect(`/login`);
    }else{
res.render('index',{"username":req.session.username})
//   res.sendFile(__dirname + '/index.html');
    }

});
app.get('/login', function(req, res){
if(req.session.username){
 res.redirect(`/`);
    }else{

  res.sendFile(__dirname + '/login.html');
    }
//   res.sendFile(__dirname + '/login.html');
});
app.post('/logins', function(req, res){
    req.session.username=req.body.username
// res.json(req.body.hoho)
res.redirect(`/`);
//   res.sendFile(__dirname + '/login.html');
});
app.get('/logout',(req,res)=>{
    req.session.destroy();
})
io.on('connection', function(socket){
   socket.on('chat message', function(msg){
    console.log(msg);
     io.emit('chat message', msg);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log(`lucu on ${process.env.PORT}`);
});