'use strict';

var express = require('express');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var stormpath = require('express-stormpath');
var app = express();
var bodyParser = require('body-parser');
var _ = require('lodash');
require('dotenv').load();


//*
var mongoURL = process.env.MONGODB_URI;

// 配置 stormpath 
app.use(stormpath.init(app, {
    website: true,
    apiKey: {
      id: process.env.STORMPATH_CLIENT_APIKEY_ID, 
      secret: process.env.STORMPATH_CLIENT_APIKEY_SECRET
    },
    application: {
      href: process.env.STORMPATH_APPLICATION_HREF
    },
   web:{
     login:{
       title:"登录",
       form:{
         fields:{
           login:{
             label:"用户名(邮件格式)",
             placeholder:"email@XXXX.com"
           }
         },
         password:{
           label:"登录密码"
         }
       }
     },
     register:{
       title:"注册用户",
       form:{
         fields:{
            givenName: {
            enabled: false
          },
          surname: {
            enabled: false
          },
          email:{
             label:"用户名(邮件格式)",
             placeholder:"email@XXXX.com"
           }
         },
         password:{
           label:"登录密码"
         }
       }
     }
   }
   
}));

var foursquare = require('node-foursquare-venues')(process.env.FOURSQUARE_CLIENT_ID, process.env.FOURSQUARE_CLIENT_SECRET);

app.set('port', (process.env.PORT || 80));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 设置模板目录和处理技术
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', stormpath.getUser, function(request, response) {
  if (request.user) {
		response.render('pages/index', { user : request.user.email });
	}	else {
		response.render('pages/index', { user :"_null_@"+request.ip  });
	}
});
//*
app.get('/search/:search',  function(request, response) { // 根据地名返回酒吧数据json
  foursquare.venues.search({ near: request.params.search, query: 'bar nightlife' },function(err,data){
    if(err){
      response.end(JSON.stringify([]));
    }else{
      response.end(JSON.stringify(data.response.venues));
    } 
  })
});
//*/

app.on('stormpath.ready', function() {
  //*
  app.listen(app.get('port'), function() {
    console.log('程序监听端口为', app.get('port'));
  });
  //*/
});

//* 设置是否到某个酒吧
app.get('/updatebar/:id',stormpath.loginRequired,function(request, response){ // 更新参加信息
  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    updatejoin(db, function(rt) {
        db.close();
        response.json(rt);
    }, {barID:request.params.id,username:request.user.email});
  });
});

app.get('/getjoin/:id',function(request, response){ // 获取参加信息
  var id=request.params.id;//分出要查询的各个酒吧id
  // 查询数据
  // 根据id过滤数据
  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    findJoin(db, function(rt) {
        db.close();
        // 返回
        response.json(rt);
    }, {"id":id});
  });
});
//*/

//* 系列功能函数

// 搜索酒吧访问情况
var findJoin = function(db, callback, inobj) {
  // inobj={id:id}
  // rt={id:[user1,user2,...]}
  var rt = {};
  var id=inobj.id
  rt[id]=[];
    db.collection('nightlife').findOne( { "_id": new ObjectId(id) },function(err,doc){
      assert.equal(err, null);
        if (doc != null) {
         rt[id]=doc["users"];
         callback(rt);
         return ;
        }
        callback(rt);
    });
};

// 插入/更新记录
var updatejoin = function(db, callback, joinData) {
  var rt={};
  var flag=true;
  // joinData={barID,username});
  rt[joinData.barID]=[];
  // 搜索是否有 barID 数据
  db.collection('nightlife').findOne( { "_id": new ObjectId(joinData.barID) }, function(err,doc){
        //assert.equal(err, null);
      if (doc != null) {
         flag=false;
         rt[joinData.barID]=doc.users;  //获取旧的情况
      }
   var s=_.indexOf(rt[joinData.barID], joinData.username)
   if( s> -1 ){ //已经有那个用户
     rt[joinData.barID].splice(s,1);
   }else{ // 没有用户
     rt[joinData.barID].push(joinData.username)
   }
   if(flag){ // 插入
      db.collection('nightlife').insertOne( {
        _id: new ObjectId(joinData.barID),
        "users" : rt[joinData.barID]
      }, function(err, results) {
        callback(rt);
      });
   }else{  // 更新
     db.collection('nightlife').updateOne(
        {_id: new ObjectId(joinData.barID)},
        {
          $set: {"users":rt[joinData.barID]}
        }, function(err, results) {
        callback(rt);
      });
   }
  });
};

//*/