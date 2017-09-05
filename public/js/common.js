/*
* @Author: Marte
* @Date:   2017-08-15 20:00:03
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-02 15:45:53
*/


$(function(){

        // 判断是否登录
        var userInfo = localStorage.getItem('userInfo');
        if(userInfo){
            userInfo = JSON.parse(userInfo);
            $('#no_login').css({
                display:'none'
            });
            $('#is_login').css({
                display:'block'
            });
            $('#userName').html(userInfo[0].userName).attr('href','/front/zhuye/'+userInfo[0].userId);

        }else{
            $('#is_login').css({
                display:'none'
            });
            $('#no_login').css({
                display:'block'
            });
        }
        $('#exit').click(function(event) {
            event.preventDefault();
            $.ajax({
                url: '/api/logout',
                type: 'get',
                data: {userName: userInfo.userName},
            })
            .done(function() {
                localStorage.removeItem('userInfo');
                alert('成功退出系统');
                location.href = '/front/shequ';
            })
        });

})