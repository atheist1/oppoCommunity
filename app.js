/*
* @Author: Marte
* @Date:   2017-08-10 19:25:59
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-03 13:27:41
*/

// 核心express
const express = require('express');

// ejs
const ejs = require('ejs');

// 前台路径
const front = require('./router/front');
// 后台路径
const api = require('./router/api');
// post请求头
const bodyParser  = require('body-parser');
// 数据库配置文件
const config = require('./config/db.config');
const mysql = require("mysql");
// 引入与session相关中间件
const cookieParser = require('cookie-parser');
const session = require('express-session');
// 引入数据库session，将node session持久化
const SessionStore = require('express-mysql-session');


// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false,formLimit : "5mb",
    jsonLimit:"5mb",
    textLimit:"5mb" })


// 创建express实例应用
var app = express();

// 将session持久化到数据库中
sessionStore = new SessionStore({
    host:'localhost',
    user:'root',
    password:'root',
    database:'test',
    port:'3306',
    schema:{
        tableName:'session',
        columnNames:{
            session_id:'id',
            expires:'expires',
            data:'data'
        }
    }
},mysql.createConnection(config));

/*
    设置html引擎
    第一个参数,模板引擎的名称；也就是要解析的模板的后缀名
    第二个参数：使用该模板引擎去解析后缀名为.html的文件
*/
app.engine('html', ejs.__express);
// 设置了视图引擎
app.set('view engine', 'html');

// 设置处理视图时去查找的路径
app.set('views','./views')
// 静态资源托管，让express加载静态资源,采用中间件的方式,让识别加载public路径内容所采用
app.use("/public",express.static(__dirname+'/public'));

// 设置bodyParser
app.use(bodyParser.urlencoded({ extended: false ,'limit':'100000kb'}));
app.use(bodyParser.json({limit: '100000kb'})); // for parsing application/json
// app.use(bodyParser.urlencoded({limit: '10mb', extended: true })); // for parsing application/x-www-form-urlencoded
/*使用session*/
// express session依赖cookieParse
app.use(cookieParser());
// 配置session
app.use(session({
    key:'liuyanban',
    secret:'12345',
    cookie:{
        maxAge:6*60*60*1000
    },
    // 对session本地化持久参数
    store:sessionStore,
    // 延长session时间
    rolling:true,
    resave:true,
    saveUninitialized:true,

}))



// 禁止用户访问其他页面
/*app.use(function(req,res,next){

    if(!req.session.user){
        if(req.url=="/front/login" || req.url=="/api/login" || req.url=="/" || req.url=="/front/register" || req.url=="/api/register"||req.url=="/front/validateName"||req.url=="/api/validateName"||req.url=="/front/shequ"||req.url=="/api/shequ"||req.url=="/api/community/getNotes"){
            next();
        }else{
            res.redirect('/front/shequ');
        }
    }
})*/
// 请求进来，跳转前台页面
// app.set('/','/front')
app.use('/front',front);
app.use('/api',api);



app.get("/",function(req,res){
    // 重定向到localhost:8080/api/这个路由
    res.redirect("front/shequ");
});
// 处理404

/*app.get("*",function(req,res){
    // 重定向到localhost:8080/api/这个路由
    res.render("./templete/404");
});*/
app.listen("8080",function(){
    console.log('当前项目已启动，请访问localhost:8080')
})