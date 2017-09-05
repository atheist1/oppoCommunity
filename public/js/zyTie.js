/*
* @Author: Marte
* @Date:   2017-08-20 14:01:21
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-03 14:38:14
*/

$(function(){
    var getDataId = $('#myzy').attr('data-userId')||$('#otherzy').attr('data-userId');
    var  userInfo = localStorage.getItem('userInfo');
    // 加载个人帖子
    $.ajax({
        url: '/api/community/getZyTieData',
        type: 'get',
        data: {userId: getDataId},
    })
    .done(function(res){
        // 判断个人空间或者他人空间

        var isMe = '';
        // 有这个人数据
        for (var i = 0; i < res.data.length; i++) {
            /*对时间进行处理*/
            var publishdate = parseInt(res.data[i].times);
            var now = new Date().getTime();
            var cha = now-publishdate;
            var secend = Math.floor(cha/(1000));
            var minutes = Math.floor(cha/(1000*60));
            var shijian= Math.floor(cha/(1000*60*60)%24%30);
            var day = Math.floor(cha/(1000*60*60)/24%30);
            var month = Math.floor(cha/(1000*60*60)/24/30);
            var timeStr = '';
            if(month>0){
              timeStr = month+'月前';
            }else{
              if(day>0){
                timeStr = day + '天前';
              }else{
                if(shijian > 0){
                  timeStr  = shijian + '小时前';
                }else{
                  if(minutes > 0){
                    timeStr  = minutes + '分钟前';
                  }else{
                    timeStr = secend + '秒前';
                  }
                }
              }
            }
            /*处理时间完毕*/

            /*对数据进行处理*/
            var str = "";
            str+="<ul class='tiezi' topicsID='"+res.data[i].topicsID+"'><li class='userhead'><a href='/front/zhuye/"+res.data[i].userId+"'>"
            str+="<img src='/public/"+res.data[i].headIcon+"'></a></li>"
            if(userInfo){
              if(res.data[i].userName==JSON.parse(userInfo)[0].userName){
                  str+="<li class='username'><a href=''  style='color:#3fcab8;'>我</a><span>Lv4.高中生O粉</span>";
                  $('#noteCount').html('我的动态(<span>'+res.data.length+'</span>)');
              }else{
                    $('#noteCount').html('TA的动态(<span>'+res.data.length+'</span>)');
                  str+="<li class='username'><a href='/front/zhuye/"+res.data[i].userId+"'>"+res.data[i].userName+"</a><span>Lv4.高中生O粉</span>";
              }

            }else{
                str+="<li class='username'><a href='/front/zhuye/"+res.data[i].userId+"'>"+res.data[i].userName+"</a><span>Lv4.高中生O粉</span>";
            }
            str+="<p class='aql'><a href=''></a><span>"
            str+="<a href='' class='focus'><i></i>关注</a><a href='' class='shoucang'><i></i>收藏</a>"
            str+="<a href='' class='jubao'><i></i>举报</a></span></p></li>"
            str+="<li class='tz_time'>"+timeStr+" 来自 "+res.data[i].phoneType+".这一刻 更清晰</li><li class='tz_title'>"
            str+="<p><a href='' class='font_gre'>#"+res.data[i].title+"#</a>"+res.data[i].content+"</p></li>"
            str+="<li class='tz_pic'><a href='/front/note/"+res.data[i].contentId+"' class='img_list'>";

            for(var j = 0;j < (res.data[i].contentImg).split(',').length-1; j++){
              str+="<span><img src='/public/"+(res.data[i].contentImg).split(',')[j]+"' alt='' id='headImg'></span>";
            }
            str+="</a></li>"
            str+="<li class='tz_res'><a href='' class='res-1'><i></i>5</a>"
            str+="<a href='' class='res-2' Praise='"+res.data[i].likes+"'><i></i>"+res.data[i].likes+"</a></li></ul>";
            $(".mainLeft").append($(str));
            /*数据处理完毕*/
        }
    })


})