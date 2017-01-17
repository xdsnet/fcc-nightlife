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
var GOOGLE_MAP_KEY = process.env.GOOGLE_MAP_KEY;
var googleMapsClient = require('@google/maps').createClient({
  key: GOOGLE_MAP_KEY
});
//*/
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
app.use('/search/:search',  function(request, response) { // 根据地名返回酒吧数据json
  googleMapsClient.places({
    query:"成都酒吧+"+request.body.search,
    language:'cn',
    type:"bar"
  },function(err, res) {
    if (!err) {
      response.json(res.json);
      console.log(res.json.results);
    }else{
      console.log("ERR!"+err);
      response.json(err);
    }
  })
});
//*/
app.post('/join',function(request, response){

});

app.on('stormpath.ready', function() {
  app.listen(app.get('port'), function() {
    console.log('程序监听端口为', app.get('port'));
  });
});