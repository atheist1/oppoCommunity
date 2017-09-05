/*
* @Author: Marte
* @Date:   2017-07-27 16:47:23
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-02 15:46:19
*/

$(function(){

    /*输入框提示功能*/
    $('.input_area input[name=username]').focus(function(){
        $('.placeholder').eq(0).css('display','none');
    }).blur(function(){
        if($(this).val()==''){
            $('.placeholder').eq(0).css('display','block');
        }else{
            $('.placeholder').eq(0).css('display','none');
        }
    });
    $('.input_area input[name=pwd]').focus(function(){
        $('.placeholder').eq(1).css('display','none');
    }).blur(function(){
        if($(this).val()==''){
            $('.placeholder').eq(1).css('display','block');
        }else{
            $('.placeholder').eq(1).css('display','none');
        }
    });



    /*登陆验证ajax*/
    $("#login_btn").click(function(event) {
        var username=$('#username').val();
        var pwd=$('.input_area input[name=pwd]').val();
        var phone='',email='';
        event.preventDefault();
        // 先判空
        if(username==''){
            $('#error').html('账号不能为空').css('display','block');
            return;
        }else if(pwd==''){
            $('#error').html('密码不能为空').css('display','block');
            return;
        }else{
            if(/^1[34578]\d{9}$/.test(username)){
                $("#login_btn").attr('disabled',true);
                $.ajax({
                    type:"post",
                    url:"/api/login",
                    data:{
                        'userTel':username,
                        'pwd':pwd,
                    },
                }).done(function(res){
                    $("#login_btn").attr('disabled',false);
                    // 判断密码是否正确
                    if(res.stat=='error'){
                        $('#error').html('用户名或密码不正确').css('display','block');
                    }else if(res.stat=='ok'){
                        localStorage.setItem('userInfo',JSON.stringify(res.userInfo))
                        console.log(JSON.parse(localStorage.getItem('userInfo')));
                        location.href = './shequ';
                    }
                });
            }else{
                $('#error').html('请输入正确的用户名格式').css('display','block');
                return;
            }
        }
    })
})
