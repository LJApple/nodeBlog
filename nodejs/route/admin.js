const express = require('express');
const common = require('../libs/common');
const mysql  = require('mysql');

var db = mysql.createPool({host:'localhost',user:'root',password:'lvjun',database:'learn'});

module.exports = function(){
	var router = express.Router();
	
	// 检查登录状态
	router.use((req,res,next)=>{
		if(!req.session['admin_id'] && req.url != '/login'){
			res.redirect('/admin/login');
		} else {
			next();
		}
	});
	
	router.get('/login',(req,res)=>{
		res.render('admin/login.ejs',{});
	});
	router.post('/login',(req,res)=>{
		var username = req.body.username;
		var password = common.md5(req.body.password + common.MD5_suffix);
		
		db.query(`SELECT * FROM admin_table WHERE username='${username}'`,(err,data)=>{
			if(err){
				res.status(500).send('database error').end();
			} else {
				if(data.length == 0){
					res.status(400).send('no this addmin').end();
				} else {
					console.log(data[0].password+':'+password)
					if(data[0].password == password){
						// 成功
						req.session['admin_id'] = data[0].ID;
						res.redirect('/admin/');
					} else {
						res.status(400).send('password is incorrect').end();
					}
				}
			}
		});
	});
	
	router.get('/',(req,res)=>{
		res.render('admin/index.ejs');
	});
	router.get('/banners',(req,res)=>{
		res.render('admin/banners.ejs',{});
	});
	return router;
};
