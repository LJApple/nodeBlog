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
					console.log(password);
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
		db.query(`select * from banner_table`,(err,data)=>{
			if(err){
				res.staus(500).send('database error').end();
			} else {
				res.render('admin/banners.ejs',{data:data});
			}
		});
	});
	router.post('/banners',(req,res)=>{
		var title = req.body.banner_title;
		var desc = req.body.banner_desc;
		var src = req.body.banner_src;
		if (!title || !desc || !src) {
			res.status(400).send('arg error').end();
		} else {
			db.query(`insert  into banner_table (title,description,href) value('${title}','${desc}','${src}')`,(err,data)=>{
			if(err){
				res.status(500).send('database error').end();
			} else {
				res.redirect('/admin/banners');
			}
		});
		}
	});
	return router;
};
