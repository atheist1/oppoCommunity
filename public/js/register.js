/*
* @Author: Marte
* @Date:   2017-07-27 19:17:41
* @Last Modified by:   Marte
* @Last Modified time: 2017-08-15 13:21:58
*/

$(function(){
    /*输入框提示功能*/
    $('.input_area input[name=username]').focus(function(){
        $('.placeholder').eq(0).css('display','none');
    }).blur(function(){
        if($(this).val()==''){
            $('.placeholder').eq(0).css('display','block');
            $('#error').html('账号不能为空').css('display','block');
        }else if(!(/^1[34578]\d{9}$/.test($(this).val()))){
            $('#error').html('请输入正确的手机格式').css('display','block');
            return;
        }else{
            $('.placeholder').eq(0).css('display','none');
            $('#error').html('账号不能为空').css('display','none');
        }
        // 发送验证请求
        $.ajax({
            url: '/api/validateName',
            type: 'get',
            data: {userTel:$('.input_area input[name=username]').val()},
        })
        .done(function(res){

            if(res.stat=='exist'){
                $('#error').html('账号已存在').css('display','block');
                $('#register_btn').attr('disabled',true);
            }else{
                $('#register_btn').attr('disabled',false);
            }
        })

    });
    $('.input_area input[name=password]').focus(function(){
        $('.placeholder').eq(1).css('display','none');
    }).blur(function(){
        if($(this).val()==''){
            $('.placeholder').eq(1).css('display','block');
        }else{
            $('.placeholder').eq(1).css('display','none');
        }
    });
    $('.input_area input[name=uname]').focus(function(){
        $('.placeholder').eq(2).css('display','none');
    }).blur(function(){
        if($(this).val()==''){
            $('.placeholder').eq(2).css('display','block');
        }else{
            $('.placeholder').eq(2).css('display','none');
        }
    });

    $('#register_btn').click(function(event) {
        var username = $('input[name=username]').val();
        var uName = $('input[name=uname]').val();
        var pwd =  $('.input_area input[name=password]').val();
        if(username==''){
            $('#error').html('账号不能为空').css('display','block');
            return;
        }else if($('#checkbox').hasClass('unchecked')){
            alert('请阅读oppo守则');
        }else{
            // 发送ajax请求
            $.ajax({
                type:"post",
                url:"/api/register",
                    data:{
                        'userTel':username,
                        'uName':uName,
                        'userPas':pwd
                    },
                    success:function(res){
                        console.log(123+res)
                        if(res.stat=='registerSuccess'){

                            location.href = './login'
                        }
                    },
                })
            }

    })

    /*checkbox*/
    $('#checkbox').click(function(event) {
        if($(this).hasClass('checked')){
            $(this).removeClass('checked').addClass('unchecked');
        }else if($(this).hasClass('unchecked')){
            $(this).removeClass('unchecked').addClass('checked');
        }
    });
});



