/*
* @Author: Marte
* @Date:   2017-08-14 22:30:43
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-02 15:46:10
*/

$(function(){
    // 处理未登录用户
    if(localStorage.getItem('userInfo')){
        var userInfo = JSON.parse(localStorage.getItem('userInfo'))[0];
        $('#head').html('欢迎'+userInfo.userName+'登录留言系统');

    }else{
        location.href = '/';
    }

    $('#tuichu').click(function(event) {
        event.preventDefault();
        $.ajax({
            url: '/api/logout',
            type: 'get',
            data: {userName: userInfo.userName},
        })
        .done(function() {
            localStorage.removeItem('userInfo');
            alert('成功退出系统');
            location.href = '/';
        })



    });
})