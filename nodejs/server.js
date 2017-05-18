const express=require('express');
const static=require('express-static');
const bodyParser=require('body-parser');
const multer=require('multer');
const multerObj=multer({dest: './static/upload'});
const mysql=require('mysql');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const consolidate=require('consolidate');
const expressRoute=require('express-route');

var server=express();
server.listen(8080);

//1.获取请求数据
//get自带
server.use(multerObj.any());

//2.cookie、session
server.use(cookieParser());
(function (){
  var keys=[];
  for( i=0;i<100000;i++){
    keys[i]='a_'+Math.random();
  }
  server.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 20*60*1000  //20min
  }));
})();

//3.模板
server.engine('html', consolidate.ejs);
server.set('views', 'template');
server.set('view engine', 'html');

//4.route
var r1 = express.Router();
var r2 = express.Router();

server.use('/article/',r1);

server.use('/1.html',function(req,res){
	res.send('我是文章').end();
});
server.use('/2.html',function(req,res){
	res.send('我是文章2').end();
});
server.use('/blog/',r2);

server.use('/a.html',function(req,res){
	res.send('我是blog').end();
});
server.use('/b.html',function(req,res){
	res.send('我是blog').end();
});
//5.default：static
server.use(static('./static/'));
