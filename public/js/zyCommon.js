/*
* @Author: Marte
* @Date:   2017-08-19 21:51:17
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-02 15:46:57
*/
$(function(){
    // 用来加载数据的id
    var  userInfo = localStorage.getItem('userInfo');
    var user = [{userId:''}]
    if(userInfo){
        user = JSON.parse(userInfo)
    }
    var getDataId = $('#myzy').attr('data-userId')||$('#otherzy').attr('data-userId');
    $.ajax({
        url: '/api/community/getZyData',
        type: 'get',
        data: {
            userId: getDataId,
            myId: user[0].userId||''
        },
    })
    .done(function(res) {
        // str储存头像资料，str1储存访客关注
        var str = '',str1='';
        // 如果没有当前这个人的数据
        if(res.stat == 'noZyData'){
            location.href='/front/404';
        }
        str+='<a href="/front/zhuye/'+res.userId+'" title="" class="per"><img src="/public/'+res.headIcon+'" alt="" id="headImg"></a>';
        str+= '<h1>'+res.userName+'</h1>';
        str+='<h4>'+res.userSig+'</h4>';
        if(!$('#myzy').attr('data-userId')&&userInfo){
            if(res.isFocus){
                str+='<button type="button" id="focus" class="isFocus" isFocus="true">已关注</button>';
            }else{
                str+='<button type="button" id="focus" class="nofocus" isFocus="false">+关注</button>';
            }
        }
        str1+='<li><a href="/front/focus/'+res.userId+'"><b>'+res.focus+'</b><span>关注</span></a></li>';
        str1+='<li><a href="/front/fans/'+res.userId+'"><b>'+res.fans+'</b><span>粉丝</span></a></li>';
        str1+='<li><a href=""><b>258</b><span>访客</span></a></li>';
        $('.bck').html(str);
        $('#box').html(str1);

    })

    /*关注他人,要用事件委托*/
    $('.bck').on('click', '#focus', function(event) {
        event.preventDefault();
        var isFocus = false;
        $(this).attr('disabled',true)
        if($(this).hasClass('nofocus')){
            $.ajax({
                url: '/api/community/focus',
                type: 'post',
                data: {
                    // 关注者id和被关注id
                    focusId: JSON.parse(userInfo)[0].userId,
                    focusedId:getDataId,
                    focusTime:new Date().getTime(),
                },
            })
            .done(function(res) {
                $('#focus').attr('disabled',false).removeClass('nofocus').addClass('isFocus').html('已关注');
            })
        }else{
            $.ajax({
                url: '/api/community/unFocus',
                type: 'post',
                data: {
                    // 关注者id和被关注id
                    focusId: JSON.parse(userInfo)[0].userId,
                    focusedId:getDataId,
                },
            })
            .done(function(res) {
                $('#focus').attr('disabled',false).removeClass('isFocus').addClass('nofocus').html('+关注');

            })
        }

    })
})