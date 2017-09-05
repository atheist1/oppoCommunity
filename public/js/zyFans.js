/*
* @Author: Marte
* @Date:   2017-08-21 23:12:10
* @Last Modified by:   Marte
* @Last Modified time: 2017-08-22 14:26:10
*/

$(function(){
    var userId = ($('#myzy').attr('data-userId')||$('#otherzy').attr('data-userId'));
    $.ajax({
        url:"/api/community/getFans",
        data:{
            "userId":userId
        }
    }).done(function(res){
        var str='';
        if(res.stat=='noData'||res.stat=='sqlQueryError'){
            return;
        }
        // 粉丝数
        $('#foucs').html('粉丝(<span>'+res.data.length+'</span>)');
        for (var i = 0; i < res.data.length; i++) {
            str+='<li class="tiezi"><a href="/front/zhuye/'+res.data[i].userId+'" class="userhead">'
            str+='<img src="/public/'+res.data[i].headIcon+'"></a>'
            str+='<h2><a href="">'+res.data[i].userName+'</a>'
            if (res.data[i].sex=="male") {
                str+='<i class="male"></i>';
            }
            else{
                str+='<i class="female"></i>';
            }
            str+='<span class="Group">Lv'+res.data[i].level+'.大专生O粉</span></h2>'
            str+='<p>'+res.data[i].userSig+'</p></li>'
        }
        $(".tiezi-container").append(str);
    })
})