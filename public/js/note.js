/*
* @Author: Marte
* @Date:   2017-09-02 16:02:32
* @Last Modified by:   Marte
* @Last Modified time: 2017-09-03 14:28:11
*/

$(function(){
    var noteId = $('#noteId').attr('data-noteId');
    var userInfo = localStorage.getItem('userInfo');
    $.ajax({
        url: '/api/community/noteData',
        type: 'get',
        data: {
            noteId: noteId
        },
    })
    .done(function(res){

        // title
        var str = `<li>
                        <a href="/front/zhuye/${res.data[0][0].userId}" class="uhead"><img src="/public/${res.data[0][0].headIcon}" alt=""></a>
                        <h2>
                            <a href="/front/zhuye/${res.data[0][0].userId}">${res.data[0][0].userName}</a>
                            <i></i>
                            <span class="group">星拍客</span>
                        </h2>
                        <p>来自 ${res.data[0][0].phoneType}</p>
                    </li>`;
        $('.self').html(str);
        // content
        /*对时间进行处理*/
        var publishdate = parseInt(res.data[0][0].times);
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
        var str1 = `<p id="time">
                    <span class="like">喜欢 120</span>
                        ${timeStr}
                    </p>
                    <div id="title">
                        <a href="">#${res.data[0][0].title}</a>
                        <span>${res.data[0][0].content}</span>

                    </div>`
        for(var j = 0;j < (res.data[0][0].contentImg).split(',').length-1; j++){
            str1+="<span><img src='/public/"+(res.data[0][0].contentImg).split(',')[j]+"' alt=''></span>";
        }
        $('#mainCon').html(str1);

        // 处理回复
        var str3 = '';
        for(var item in res.data[1]){
            /*对时间进行处理*/
            var publishdate = parseInt(res.data[1][item].comTime);
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
            str3 += '<ul class="tiezi">';
            str3 += '<li class="userhead"><a href="/front/zhuye/'+res.data[1][item].userId+'"><img src="/public/'+res.data[1][item].headIcon+'"></a></li>';
            str3 += '<li class="username"><a href="/front/zhuye/'+res.data[1][item].userId+'">'+res.data[1][item].userName+'</a><span>Lv4.高中生O粉</span><p><a href=""></a><span><a href="" class="focus"><i></i>关注</a><a href="" class="shoucang"><i></i>收藏</a><a href="" class="jubao"><i></i>举报</a></span></p></li>';
            str3 += '<li class="tz_time">'+timeStr+' 来自'+res.data[1][item].phoneType+'</li>';
            str3 += '<li class="tz_title"><p>'+res.data[1][item].comContent+'</p></li>';
            str3 += '<li class="tz_res"><a href="" class="res-1"><i></i>123</a><a href="" data-zan="res-2"><i></i>123</a></li></ul>';
        };
        $('#comments').html(str3);
    });

    // 提交评论
    $('#postCom').click(function(event) {
        userInfo = localStorage.getItem('userInfo');
        var comCon = $('#comCon').val();
        if(!userInfo){
            alert('请登录');
            return;
        }else if(!comCon){
            alert('请输入内容');
            return;
        }else{
            var user = JSON.parse(userInfo);
            $.ajax({
                url: '/api/community/postCom',
                type: 'post',
                data: {
                    userId:user[0].userId,
                    comCon:comCon,
                    noteId:noteId
                },
            })
            .done(function(res) {
                if(res.stat == 'success'){
                    location.reload()
                }
            })
        }


    });
})