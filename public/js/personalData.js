/*
* @Author: Marte
* @Date:   2017-08-22 13:54:40
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-02 15:46:33
*/

$(function(){
    var userId = ($('#myzy').attr('data-userId')||$('#otherzy').attr('data-userId'));
    $.ajax({
        url: '/api/community/getData',
        type: 'get',
        data:{
            'userId':userId
        },
        success:function(res){
            /*// 头像
            var str1='';
            // for(var i=0;i<res.data.length;i++){
                str1+='<a href="" title="" class="per" id="update_img"><img src="/public/'+res.data[0].headIcon+'" alt=""></a><h1>'+res.data[0].uName+'</h1><h4>'+res.data[0].userSig+'</h4>';
            // }
            $('.bck').html(str1);*/
            // 主体内容
            str='';
            str+='<table><tbody>'
            str+='<tr class="username"><th>用户名</th><td>'+res.data[0].userName+'</td></tr>';
            str+='<tr class="userid"><th>用户ID</th><td>'+res.data[0].userId+'</td></tr>';
            if(res.data[0].sex=='female'){
                str+='<tr class="sex"><th>性别</th><td>女</td></tr>';
            }else{
                 str+='<tr class="sex"><th>性别</th><td>男</td></tr>';
            }
            str+='<tr class="userid"><th>个性签名</th><td>'+res.data[0].userSig+'</td></tr>';
            str+='<tr class="point"><th>积分</th><td>'+res.data[0].level+'</td></tr></tbody></table>';
            $('.userInfo').html(str)
        }
    });
    // 修改资料
    $('.edit').click(function(event) {
        $('#edit_form').show();
        $('.mask').show();
    });
    $('.close').click(function(event) {
        $('#edit_form').hide();
        $('.mask').hide();
    });

    // 修改资料
    $('.sub').click(function(event) {
        // 利用formdata传图
        var file = document.getElementById('headIcon');
        var formData = new FormData();
        // 获取内容
        var username = $('#username').val();
        var sig = $('#sig').val();
        var sex = $('input:radio:checked').val();
        var oldPath = $('#headImg').attr('src');
        console.log(oldPath)
        /*向表单插入数据*/
        formData.append('file',file.files[0]);
        formData.append('userName',username);
        formData.append('userSig',sig);
        formData.append('sex',sex);
        formData.append('oldPath','.'+oldPath);
        formData.append('userId',($('#myzy').attr('data-userId')||$('#otherzy').attr('data-userId')));
        $.ajax({
            url: '/api/community/changeData',
            type: 'post',
            data: formData,
            contentType: false, //不可缺参数
            processData: false, //不可缺参数
            cache: false,
        })
        .always(function(res) {
            if(res!=''){
                localStorage.setItem('userInfo',JSON.stringify(res.data))
            }
            // 重载
            // location.reload();
        })
    });
})