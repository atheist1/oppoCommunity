$(function(){
  var  userInfo = localStorage.getItem('userInfo');

  // 初次加载获取所有帖子
  $.ajax({
    url: '/api/community/getNotes',
    type: 'get',
  })
  .done(function(res) {
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

        var str = "";
        str+="<ul class='tiezi' topicsID='"+res.data[i].topicsID+"'><li class='userhead'><a href='/front/zhuye/"+res.data[i].userId+"'>"
        str+="<img src='../public/"+res.data[i].headIcon+"'></a></li>"
        if(userInfo){
          if(res.data[i].userName==JSON.parse(userInfo)[0].userName){
              str+="<li class='username'><a href=''  style='color:#3fcab8;'>我</a><span>Lv4.高中生O粉</span>";
          }else{
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
          str+="<span><img src='../public/"+(res.data[i].contentImg).split(',')[j]+"' alt=''></span>";
        }
        str+="</a></li>"
        str+="<li class='tz_res'><a href='' class='res-1'><i></i>5</a>"
        str+="<a href='' class='res-2' Praise='"+res.data[i].likes+"'><i></i>"+res.data[i].likes+"</a></li></ul>";
        $(".mainLeft").append($(str));
    }
  })


  // 点击切换显示和隐藏
  $(".search").click(function(e){
    	e.preventDefault();
    	$(".top_sear").toggle();
  })

  // 轮播图开始
  var index = 0;
  var timer = null;

  for (var i = 0; i < $(".img li").length; i++){
      $(".num").append("<li></li>");
  }
  $('.num li').first().addClass('active');
  var firstimg=$('.img li').first().clone(),
      lastimg=$('.img li').last().clone();
  $('.img').append(firstimg).prepend(lastimg).width($('.img li').length*($('.img img').width()));
  $(".prev").click(function(){
      if($(".img").is(":animated")){
          return;
      }
      index--;
      $(".img").animate({left:"+=1080"},300,function(){
          if(index==-1){
              index = 4;
              $(this).css({left:"-5400px"});
          }
          $('.num li').eq(index).addClass("active").siblings().removeClass('active');
      });
  })

  $('.num li').click(function(){
      index = $(this).index();
      $(".img").animate({left:(index+1)*-1080},300);
      $('.num li').eq(index).addClass("active").siblings().removeClass('active');
  })

  function run(){
      index ++ ;
      $(".img").animate({left:"-=1080"},300,function(){
          if(index==5){
              index = 0;
              $(this).css({left:"-1080px"});
          }
          $('.num li').eq(index).addClass("active").siblings().removeClass('active');
      });
  }

  timer = setInterval(run, 2000);

  $(".banner").hover(function(){
      $(".btn").show();
      clearInterval(timer);
  },function(){
      $(".btn").hide();
      timer = setInterval(run, 2000);
  })
// 轮播图结束


  $(".mainLeft").on("mouseover",".aql",function(e){
      e.preventDefault();
      $(this).children("span").addClass("show");
  },function(){
      $(this).children("span").removeClass("show");
  })

  // 帖子菜单选项的hover效果结束

  // 点击帖子跳转 开始
  $(".mainLeft").on("click",".tiezi",function(){
      var id = $(this).attr("topicsId");

      /*$.ajax({
        url:"http://192.168.94.19:8080/OPPODemo/bbs?type=zhutie",
        dataType:'jsonp',
        jsonp:"jsonpCallback",
        data:{
          "topicsId":id
        }
      }).done(function(data){
        localStorage.setItem("topicsId",JSON.stringify(id));
      })*/
  });

  $(".tiezi .tz_pic .img_list").attr("href","http://www.baidu.com");
  $(".mainLeft").on("click",".res-1",function(e){
      e.preventDefault();
  })

  // 点击帖子跳转 结束

  // 点赞图标变色开始

  // var Praise = attr("Praise");
  $(".mainLeft").on("click",".res-2",function(e){
      e.preventDefault();
      e.stopPropagation();
      $(this).toggleClass("love");
      if($(this).hasClasss("love")){
        Praise+=1;
      }else{
        Praise-=1;
      }
      $(this).html("<i></i>"+Praise)
  })
  // 点赞图标变色结束

  // 搜索栏开始


  $('#nav').on('click', '.btn_ser', function(event) {
      var val = $(".top_sear input").val();
      var url='../html/sousuo.html?'+val;
      localStorage.setItem('search',val)
      window.location.href=url;

  });


})


