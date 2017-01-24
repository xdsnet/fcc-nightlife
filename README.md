# nightlife-app 任务 
nightlife-app 任务

服务演示地址[https://xdsnightlifeapp.herokuapp.com/](https://xdsnightlifeapp.herokuapp.com/)

## 任务需求
1. 作为一个未授权用户，我可以看到我附近的所有酒吧。
1. 作为一个已授权用户，我可以把我自己添加到一个酒吧，表示我今晚将会去那儿。
1. 作为一个已授权用户，如果我不再想去某个酒吧，可以把自己从酒吧中移出。
1. 作为一个未授权用户，在我登录后我不需要重新搜索附近的酒吧。

## 实现说明

1. 使用了`mongodb`数据库服务用于持久化数据,数据利用[https://mlab.com](https://mlab.com)提供的500MB免费数据空间部署(因为herokuapp上直接使用mongodb需要付费！这里是免费的，用着任务展示已经足够)，使用`mongodb`模块访问数据库服务，你也可以使用其他mongodb数据服务。
1. 使用`ejs`作为模版处理模块
1. 使用`stormpath`实现注册和认证处理(相关数据信息等存储在stormpath网站上，这样减轻了本地处理的繁琐。)
1. 使用`foursquare服务`的相关服务实现全球搜索。（本版先实现服务器端代理搜索，客户端展示，服务器端仅仅实现少量数据存储（仅存储是否到店的信息））

## 关于`.env`文件或者环境变量
  程序因为用到`mongodb`和`stormpath`需要用到一些环境变量，这些环境变量可以利用`.env`文件设置（程序中利用`dotenv`模块引入），也可以通过其他途径给出（只要保证程序运行前定义了，且能被程序以环境变量的形式访问即可）。用到的变量有:

| 环境变量名 | 变量值形式（缺省值）| 是否必须 |
| ------------- | ------------- | ------------- |
|  `PORT` | 数字值，缺省80 | 否  |
|  `MONGODB_URI` | 字符串，形如`mongodb://<User>:<UserPassowrd>@<Host>/<Path>` | 是  |
|  `STORMPATH_CLIENT_APIKEY_ID` | 字符串值，由stormpath提供 | 是  |
|  `STORMPATH_CLIENT_APIKEY_SECRET` | 字符串值，由stormpath提供 | 是  |
|  `STORMPATH_APPLICATION_HREF` | `https://api.stormpath.com/v1/applications/<字符串>`，其中的字符串由stormpath提供 | 是  |
|  `FOURSQUARE_CLIENT_ID` | [https://developer.foursquare.com/](https://developer.foursquare.com/)申请的一个key,用于调用`foursquare服务`，其和 `FOURSQUARE_CLIENT_SECRET`配对使用 | 是 |
|  `FOURSQUARE_CLIENT_SECRET` | [https://developer.foursquare.com/](https://developer.foursquare.com/)申请的一个key,用于调用`foursquare服务`，其和`FOURSQUARE_CLIENT_ID`配对使用 | 是 |
|  `FOURSQUARE_VERSION` | [https://developer.foursquare.com/](https://developer.foursquare.com/)申请的`foursquare服务`版本，默认为`20161026` | 否 |
## 待完善或补充（不一定实施）

1. mongodb切换为postgresql进行数据存储的版本设计（herokuapp提供免费的postgresql），
1. 对stormpath的相关页面定制（因为strompath上相关文档缺少，它文档中关于相关页面定制以ejs举例，但其实际实现模板又是jade，再有jade最近还闹了更名为pug的事情，搞不懂啦。）
1. 切换为google的places搜索或者百度的相关搜索（因为foursquare服务不够好）
