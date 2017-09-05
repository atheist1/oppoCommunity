/*
	专门存放和数据库相关的路由信息  接收ajax   form   图片上传
*/
// 导入express框架
const express = require('express');
// 导入数据库操作
const conn = require('../db/db');
// 处理图片上传
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

// 导入路由？？
var router = express.Router();

// 发送数据定义
var msg = {stat:'error'}

/*处理get请求*/
// 处理用户名验证
router.get('/validateName',function(req,res){
    conn.getConnection(function(err,connection){
        if(err){
            res.send(msg);
        }else{
            var sql = 'select userTel from user where userTel="'+req.query.userTel+'"';
            connection.query(sql,function(err,row){
                if(row.length>0){
                    msg = {
                        stat:'exist',
                        userInfo:row
                    }
                    res.send(msg)
                }else{
                    msg.stat = 'success';
                    res.send(msg)
                }
            })
            connection.release();
        }

    })
});
// 处理登出逻辑
router.get("/logout",(req,res)=>{
    req.session.destroy(function(err) {
        if(err){
            res.redirect("/front/login");
            return;
        }
        res.redirect('/');
        return;
    });
});

// 处理社区首页获取帖子
router.get('/community/getNotes',function(req,res){
    conn.getConnection(function(err,connection){
        if(err){
            res.redirect("/front/shequ");
            return;
        }else{
            var sql = 'select user.userName,user.userId,user.headIcon,notes.content,notes.contentImg,notes.likes,notes.times,notes.title,notes.topicsID,notes.contentId,notes.phoneType from notes,user where user.userId=notes.userId order by times desc';

            connection.query(sql,function(err,row){
                if(row.length>0){
                    msg = {
                        stat:'success',
                        data:row
                    };
                    res.send(msg);
                }else{
                    msg = {
                        stat:'error'
                    }
                    res.send(msg);
                }
            })
            connection.release();
        }
    })
});
/*处理主页获取个人数据*/

// test promise 主页数据
router.get('/community/getZyData',function(req,res){
    conn.getConnection(function(err,connection){
        if(err){
            msg = {
                stat:'mysqlError'
            }
            res.send(msg);
        }else{
            var cnn = new Promise(function(resolve,reject){
                var sql = 'select userSig,userTel,userName,headIcon,level,fans,focus,userId from user where userId="'+req.query.userId+'"';
                connection.query(sql,function(err,row){
                    if(err){
                        reject(err);
                    }else{
                        if(row.length>0){
                            resolve(row[0]);
                        }else{
                            reject('err');
                        }

                    }
                });
            })
            var cnn1 = new Promise(function(resolve,reject){
                var sql1 = 'select fansId,userId from fans where fansId="'+req.query.myId+'" and userId="'+req.query.userId+'"';
                connection.query(sql1,function(err,row){
                    resolve(row[0]);
                });
            })
            var cnnAll = Promise.all([cnn,cnn1]);
            cnnAll.then(function(data){
                data[1]==undefined?data[0].isFocus=false:data[0].isFocus=true;
                res.send(data[0]);
                return;
            }).catch(function(){
                res.send({
                    stat:'noZyData',
                })

            })
            connection.release();
        }
    })
})

router.get('/community/getZyTieData',function(req,res){
    console.log('获取帖子数据')
    conn.getConnection(function(err,connection){
        if(err){
            msg = {
                stat:'mysqlError'
            }
            res.send(msg);
        }else{
            var sql = 'select user.userName,user.userId,user.headIcon,notes.content,notes.contentImg,notes.likes,notes.times,notes.title,notes.topicsID,notes.phoneType,notes.contentId from notes,user where user.userId="'+req.query.userId+'" and user.userId=notes.userId  order by times desc';
            connection.query(sql,function(err,row){
                if(row.length>0){
                    res.send({
                        stat:'ok',
                        data:row
                    })
                }else{
                    res.send({
                        stat:'noTieData',
                        data:[]
                    })
                }
            });
            connection.release()
        }
    })
})
// fans数据
router.get('/community/getFans',function(req,res){
    conn.getConnection(function(err,connection){
        if(err){
            res.send({
                stat:'mysqlConnectionError'
            });
        }else{
            var sql = 'select * from user where userId in (select fansId from fans where userId = '+req.query.userId+')';
            connection.query(sql,function(err,row){
                if(err){
                    res.send({
                        stat:'sqlQueryError'
                    })
                }else{
                    if(row.length>0){
                        res.send({
                            stat:'success',
                            data:row
                        })
                    }else{
                        res.send({
                            stat:'noData'
                        })
                    }
                }
            })
        }
    });
})
// focus数据
router.get('/community/getFocus',function(req,res){
    conn.getConnection(function(err,connection){
        if(err){
            res.send({
                stat:'mysqlConnectionError'
            });
        }else{
            var sql = 'select userSig,userTel,userName,userId,headIcon,level,fans,focus,sex from user where userId in (select userId from fans where fansId = '+req.query.userId+')';
            connection.query(sql,function(err,row){
                if(err){
                    res.send({
                        stat:'sqlQueryError'
                    })
                }else{
                    if(row.length>0){
                        res.send({
                            stat:'success',
                            data:row
                        })
                    }else{
                        res.send({
                            stat:'noData'
                        })
                    }
                }
            })
        }
    });
})
// 个人资料页面
router.get('/community/getData',function(req,res){
    conn.getConnection(function(err,connection){
        if(err){
            res.send({
                stat:'mysqlConnectionError'
            });
        }else{
            var sql = 'select userSig,userTel,userName,userId,headIcon,level,fans,focus,sex from user where userId = '+req.query.userId+'';
            connection.query(sql,function(err,row){
                if(err){
                    res.send({
                        stat:'sqlQueryError'
                    })
                }else{
                    if(row.length>0){
                        res.send({
                            stat:'success',
                            data:row
                        })
                    }else{
                        res.send({
                            stat:'noData'
                        })
                    }
                }
            })
        }
    });
})
// 帖子回复内容
router.get('/community/noteData',function(req,res){
    conn.getConnection(function(err,connection){
        if(err){
            res.send({
                stat:'mysqlError',
                data:[]
            })
        }else{
            var sql = 'select user.userId,user.headIcon,user.userName,notes.phoneType,notes.content,notes.contentId,notes.likes,notes.title,notes.times,notes.topicsId,notes.contentImg from user,notes where notes.contentId ="'+req.query.noteId+'" and notes.userId = user.userId;select user.userId,user.headIcon,user.userName,comments.contentId,comments.comUserId,comments.comTime,comments.comContent,comments.phoneType from comments,user where comments.contentId = "'+req.query.noteId+'" and user.userId = comments.comUserId order by comments.comTime desc';
            // var sql1 = '';
            // console.log(sql1)
            connection.query(sql,function(err,row){
                if(err){
                    res.send({
                        stat:'mysqlError',
                        data:[]
                    })
                }else{
                    res.send({
                        stat:'ok',
                        data:row
                    })
                }
            })
            connection.release();
        }
    })
})
/*处理POST*/
// 处理路由请求
router.post('/login',function(req,res){
    conn.getConnection(function(err,connection){
        var sql = 'select userTel from user where userTel=?';
        // 用来处理不同状态
        if(err){
            res.redirect('./login/login');
            return;
        }else{
            sql = 'select userTel,userName,userId,headIcon,userSig from user where userTel="'+req.body.userTel+'" and userPas= "'+req.body.pwd+'"' ;
            connection.query(sql,function(err,row){
                if(row.length>0){
                    msg = {
                        stat:'ok',
                        userInfo:row
                    }
                    req.session.user = row[0].userId;
                    res.send(msg);
                }else{
                    msg = {
                        stat:'error'
                    }
                    res.send(msg);
                }
                connection.release();
            })
        }
    })
})
// 处理注册逻辑
router.post('/register',function(req,res){
    conn.getConnection(function(err,connection){
        if(err){
            res.send(msg)
        }else{
            // var sql = 'insert into user(userTel,userName,userPas) value ("'+req.body.userTel+'","'+req.body.uName+'","'+req.body.userPas+'")';
            var sql = `insert into user(userTel,userName,userPas,headIcon,level,fans,focus,userSig) value (?,?,?,?,?,?,?,?)`;
            var sqlParams = [req.body.userTel,req.body.uName,req.body.userPas,'images/community/headIcon/noavatar_small.jpg',0,0,0,'说点什么吧'];
            connection.query(sql,sqlParams,function(errs,row){
                    if(row.affectedRows >= 1){
                        msg.stat = 'registerSuccess';
                        res.send(msg);
                    }

            });
            connection.release();
        }
    })
})
// 处理帖子发布功能
router.post('/postNotes',function(req,res){
    console.log('开始文件上传');
    // test
    var form = new formidable.IncomingForm();
    var post = {},
        file = {};
    var oldpath;
    var newpath;
    var extname;
    var title,userId,content,pathUrl='',time,topicsId;
    form.uploadDir = './public/images/community/notes';  //文件上传 临时文件存放路径
    form.keepExtension = true;
    form.maxFields = 10000;
    form
        .on('error', function(err) {
            console.log(err); //各种错误
        })
         //POST 普通数据 不包含文件 field 表单name value 表单value
        .on('field', function(field, value) {
            if(field == 'title'){
                title = value;
            }else if(field == 'noteContent'){
                content = value;
            }else if(field == 'userId'){
                userId = value;
            }else if(field == 'topicsId'){
                topicsId = value;
            }else if(field == 'time'){
                time = value;
            }else if(field == 'userId'){
                userId = value;
            }


        })
        .on('file', function(field, file) { //上传文件
            var extname = path.extname(file.name);
            var extArr = ['.jpg','.jepg','.png','.gif','.bmp'];
            file[field] = file;

            if(extArr.indexOf(extname)!=-1){
                var url = './public/images/community/notes/notes' + new Date().getTime()+extname;
                fs.renameSync(file.path,url,function(err){
                });
                pathUrl += url.substring(9)+','
            }else{

                fs.unlinkSync(file.path);

            }
            // res.writeHead(200,{'Content-Type':'text/html','Access-Control-Allow-Origin':'*','Accept-Encoding':'gzip,deflate,sdch'})


        })
        .on('end', function() {
            // console.log(title,userId,content,pathUrl,time,topicsId);
            // 进行数据库调用

            conn.getConnection(function(err,connection){
                if(err){
                    res.send(msg)
                }else{
                    var sql = `insert into notes(phoneType,userId,content,contentImg,likes,title,times,topicsId) value (?,?,?,?,?,?,?,?)`;
                    var sqlParams = ['OPPO R11',userId,content,pathUrl,0,title,time,topicsId];
                    connection.query(sql,sqlParams,function(err,row){

                        res.end();
                    })
                    connection.release();
                }
            })


        });

    form.parse(req); //解析request对象

})

// 关注粉丝功能
router.post('/community/focus',function(req,res){
    conn.getConnection(function(err,connection){
        if(err){
            msg = {
                stat:'mysqlError'
            }
            res.send(msg);
        }else{
            var sql = `insert into fans(fansId,userId,focusTime) values(?,?,?)`;
            var sqlParams = [req.body.focusId,req.body.focusedId,req.body.focusTime];
            connection.query(sql,sqlParams,function(err,row){


            });
            var sql1 = 'update user set fans = fans+1 where userId = "'+req.body.focusedId+'"';
                connection.query(sql1,function(err,row){
                    // if(row.affectedRows>0){
                    //     res.send(msg);
                    // }
                })
            var sql2 = 'update user set focus = focus+1 where userId = "'+req.body.focusId+'"';
            connection.query(sql2,function(err,row){
                if(row.affectedRows>0){
                    res.send(msg);
                }
            })
            connection.release()
        }
    })
})
// 取消关注
router.post('/community/unFocus',function(req,res){
    conn.getConnection(function(err,connection){
        if(err){
            msg = {
                stat:'mysqlError'
            }
            res.send(msg);
        }else{
            var sql = 'delete  from fans where fansId="'+req.body.focusId+'" and userId = "'+req.body.focusedId+'"';

            connection.query(sql,function(err,row){
            });
            var sql1 = 'update user set fans = fans-1 where userId = "'+req.body.focusedId+'"';
                connection.query(sql1,function(err,row){
                })
            var sql2 = 'update user set focus = focus-1 where userId = "'+req.body.focusId+'"';
            connection.query(sql2,function(err,row){
                if(row.affectedRows>0){
                    res.send(msg);
                }
            })
            connection.release()
        }
    })
})

// 更改个人资料
/*router.post('/community/changeData',function(req,res){
    var form = new formidable.IncomingForm();
    var post = {},
        file = {};
    var oldpath;
    var newpath,pathUrl;
    var extname;
    var userName='',userSig='',sex='',oldPath='',userId;
    form.uploadDir = './public/images/community/notes';  //文件上传 临时文件存放路径
    form.keepExtension = true;
    form.maxFields = 10000;
    form
        .on('error', function(err) {
            console.log(err); //各种错误
        })
         //POST 普通数据 不包含文件 field 表单name value 表单value
        .on('field', function(field, value) {
            if(field == 'userName'){
                userName = value;
            }else if(field == 'sex'){
                sex = value;
            }else if(field == 'userSig'){
                userSig = value;
            }else if(field == 'oldPath'){
                oldPath = value.substring(9);
            }else if(field == 'userId'){
                userId = value;
            }

        })
        .on('file', function(field, file) { //上传文件
            var extname = path.extname(file.name);
            var extArr = ['.jpg','.jepg','.png','.gif','.bmp'];
            file[field] = file;
            if(extArr.indexOf(extname)!=-1){
                var url = './public/images/community/headIcon/' + new Date().getTime()+extname;
                // fs.renameSync(file.path,url,function(err){
                // });
                // if(oldPath!='images/community/headIcon/noavatar_big.jpg'){
                //     fs.unlinkSync('./public/'+oldPath);
                // }
                pathUrl= url.substring(9);
            }else{
                fs.unlinkSync(file.path);
            }

        })
        .on('end', function() {
            // 进行数据库调用
            conn.getConnection(function(err,connection){
                console.log(userName,sex,userSig,pathUrl,oldPath);
                if(err){
                    res.send({
                        stat:'mysqlError',
                    })
                }else{
                    var sql = '';
                    sql+= 'update user set ';
                    console.log(oldPath)
                    if(userName){
                        sql+= 'userName ="'+userName+'",';
                    }
                    if(sex!='undefined'){
                        sql+= 'sex ="'+sex+'",';
                    }
                    if(userSig){
                        sql+= 'userSig ="'+userSig+'",';
                    }
                    if(oldPath){
                        if(pathUrl){
                            sql+= 'headIcon ="'+pathUrl+'",';
                        }else{
                            sql+= 'headIcon ="'+oldPath+'",';
                        }

                    }
                    sql+='fans=fans+0 where userId = "'+userId+'"';
                    connection.query(sql)
                    var sql1 = 'select userSig,userTel,userName,userId,headIcon,level,fans,focus,sex from user where userId = '+userId+'';
                    connection.query(sql1,function(err,row){
                        if(row.length>0){
                            console.log(row)
                            res.send({
                                stat:'success',
                                data:row
                            });
                            res.end()
                        }
                    });
                    connection.release();
                }
            })
        });

    form.parse(req); //解析request对象

})*/
// 更改个人资料
router.post('/community/changeData',function(req,res){
    var form = new formidable.IncomingForm();
    var post = {},
        file = {};
    var oldpath;
    var newpath,pathUrl;
    var extname;
    var userName='',userSig='',sex='',oldPath='',userId;
    form.uploadDir = './public/images/community/headIcon';  //文件上传 临时文件存放路径
    form.keepExtension = true;
    form.parse(req,function(err,field,file){
        file = file.file;
        var extArr = ['jpg','jepg','png','gif','bmp'];
        var url = '';
        if(file){
            if(file.type.indexOf('jpg')){
                url = './public/images/community/headIcon/' + new Date().getTime()+'.jpg';
            }else if(file.type.indexOf('jepg')){
                url = './public/images/community/headIcon/' + new Date().getTime()+'.jepg';
            }else if(file.type.indexOf('png')){
                url = './public/images/community/headIcon/' + new Date().getTime()+'.png';
            }else if(file.type.indexOf('gif')){
                url = './public/images/community/headIcon/' + new Date().getTime()+'.gif';
            }else{
                console.log('error')
            }
            var pathUrl = url.substring(9);
            fs.readFile(file.path, function (err, data) {
                if (err) throw err;
                console.log('File read!');
                // Write the file
                fs.writeFile(url, data, function (err) {
                    if (err) throw err;
                    console.log('File written!');
                    return;
                });
                // Delete the file
                fs.unlink(file.path, function (err) {
                    if (err) throw err;
                    // fs.unlink(file.path, function (err) {
                    //     if (err) throw err;
                    //     console.log('File deleted!');
                    // });
                    return;
                });
                return;
            });
        }
        // 进行数据库调用
            conn.getConnection(function(err,connection){
                if(err){
                    res.send({
                        stat:'mysqlError',
                    })
                }else{
                    var sql = '';
                    sql+= 'update user set ';
                    if(field.userName){
                        sql+= 'userName ="'+field.userName+'",';
                    }
                    if(field.sex!='undefined'){
                        sql+= 'sex ="'+field.sex+'",';
                    }
                    if(field.userSig){
                        sql+= 'userSig ="'+field.userSig+'",';
                    }
                    if(field.oldPath){
                        console.log(field.oldPath,field.oldPath)
                        if(pathUrl){
                            sql+= 'headIcon ="'+pathUrl+'",';
                        }else{
                            sql+= 'headIcon ="'+field.oldPath.substring(9)+'",';
                        }
                    }
                    sql+='fans=fans+0 where userId = "'+field.userId+'"';
                    console.log(sql)
                    connection.query(sql)
                    var sql1 = 'select userSig,userTel,userName,userId,headIcon,level,fans,focus,sex from user where userId = '+field.userId+'';
                    connection.query(sql1,function(err,row){
                        if(row.length>0){
                            console.log(row)
                            try{
                                res.send({
                                    stat:'success',
                                    data:row
                                });
                                res.end()
                            }catch(e){

                            }

                        }
                    });
                    connection.release();
                }
            })
    }); //解析request对象

})
// 增加回复
router.post('/community/postCom',function(req,res){
    conn.getConnection(function(err,connection){
        if(err){
            res.send({
                stat:'mysqlConnectionError',
                data:[]
            })
        }else{
            var sql = 'insert into comments(contentId,comUserId,comTime,comContent,phoneType) value("'+req.body.noteId+'","'+req.body.userId+'","'+new Date().getTime()+'","'+req.body.comCon+'","OPPO R11.热力红")';
            console.log(sql)
            connection.query(sql,function(err,row){
                if(row.affectedRows>=1){
                    res.send({
                        stat:'success',
                        data:[]
                    })
                }else{
                    res.send({
                        sata:'success',
                        data:[]
                    })
                }
            })
            connection.release();
        }
    })
})
module.exports = router;