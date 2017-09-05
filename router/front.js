/*
    存放前台页面的路由
 */
// 引入express模块
const express = require('express');
var router = express.Router();
/*进入首页跳转到登录页面*/
router.get('/',function(req,res){
    res.redirect('/');
});

router.get('/shequ',function(req,res){
    res.render('./community/shequ');
});

// 处理注册页面跳转
router.get('/register',function(req,res){
    res.render('./login/register')
});

router.get('/login',function(req,res){
    res.render('./login/login')
})
// 发布帖子
router.get('/notePost',function(req,res){
    if(!req.session.user){
        res.redirect('/front/login')
    }else{
        res.render('./community/notePost');
    }

});
// 渲染主页
/*router.get('/zhuye',function(req,res){

    res.render('./community/zhuye')
})*/
//主页
router.get('/zhuye/:id',function(req,res){
        res.render('./community/zhuye',{userId:req.params.id,session:req.session})
});
// 主页fans
router.get('/fans/:id',function(req,res){
        res.render('./community/zyFans',{userId:req.params.id,session:req.session})
});
// 主页focus
router.get('/focus/:id',function(req,res){
        res.render('./community/zyGuanzhu',{userId:req.params.id,session:req.session})
});
// 主页个人资料
router.get('/data/:id',function(req,res){
        res.render('./community/personalData',{userId:req.params.id,session:req.session})
});

// 帖子内容页面
router.get('/note/:id',function(req,res){
        res.render('./community/note',{noteId:req.params.id,session:req.session})
});
// 处理404
router.get('/404',function(req,res){
    res.render('./templete/404');
});
// 将模块暴露出去
module.exports = router;