var express = require('express');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var stormpath = require('express-stormpath');
var app = express();
var bodyParser = require('body-parser');
var _ = require('lodash');
require('dotenv').load();

var mongoURL = process.env.MONGODB_URI;
var GOOGLE_MAP_KEY = process.env.GOOGLE_MAP_KEY;
var googleMapsClient = require('@google/maps').createClient({
  key: GOOGLE_MAP_KEY
});

// 配置 stormpath 
app.use(stormpath.init(app, {
    website: true,
    apiKey: {
      id: process.env.STORMPATH_CLIENT_APIKEY_ID, 
      secret: process.env.STORMPATH_CLIENT_APIKEY_SECRET
    },
    application: {
      href: process.env.STORMPATH_APPLICATION_HREF
   }
   //*
   ,
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
   //*/
}));

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

app.use('/search/:search',  function(request, response) { // 根据地名返回酒吧数据json
  googleMapsClient.places({
    query:"酒吧"+request.body.search,
    language:'cn',
    type:"bar"
  },function(err, res) {
    if (!err) {
      response.json(res.json);
      console.log(res.json.results);
    }else{
      console.log("ERR!"+err);
    }
});

/*

app.post('/join',function(request, response){

});

app.on('stormpath.ready', function() {
  app.listen(app.get('port'), function() {
    console.log('程序监听端口为', app.get('port'));
  });
});
//*/
/*
// query the database to pull all of the polls
var findPolls = function(db, callback) {
   var polls = [];
   var cursor = db.collection('nightlifeDB').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         polls.push(doc);
      } else {
         callback(polls);
      }
   });
};

// 查询一个具体的投票项目数据信息
var findSinglePoll = function(db, callback, id) {
  var cursor = db.collection('nightlifeDB').findOne({"_id":new ObjectId(id)}, function(err, doc) {
       callback(doc);
    });
  };
  
// 插入投票信息到具体项目
var insertDocument = function(db, callback, question, answers, username) {
  var tempAnswers = answers.split(';');
  var answers=[];
  var userlist=[];
  for(var i = 0; i < tempAnswers.length; i++){
    var tmp=_.trim(tempAnswers[i]);
    if(tmp!=""){
      answers.push( {"answer":tmp, "total":0});
    }
  }
   db.collection('nightlifeDB').insertOne( {
     "question" : question,
     "answers" : answers,
     "user" : username,
     "userlist":userlist
   }, function(err, result) {
    assert.equal(err, null);
    callback();
  });
};

// 搜索某用户创建的投票项目
var findUserPolls = function(db, callback, username) {
  var polls = [];
   var cursor =db.collection('nightlifeDB').find( { "user": username } );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         polls.push(doc);
      } else {
         callback(polls);
      }
   });
};

// 删除投票项目
var deletePoll = function(db, callback, id) {
   db.collection('nightlifeDB').deleteMany(
      {_id: new ObjectId(id)},
      function(err, results) {
         //console.log(results);
         callback();
      }
   );
};

// 更新记录
var updateTotals = function(db, callback, pollData) {
   db.collection('nightlifeDB').updateOne(
      {_id: new ObjectId(pollData.poll._id)},
      {
        $set: {"answers" : pollData.poll.answers,"userlist":pollData.poll.userlist}
      }, {upsert:true}, function(err, results) {
      //console.log(results);
      callback();
   });
};

//*/