$(function(){
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));


    $('#sub').click(function(event){
        // 利用formdata传图
        var file = document.getElementById('noteImg');
        var formData = new FormData();
        // 获取内容
        var title = $('#titles').val();
        var noteContent = $('#noteContent').val()
        /*向表单插入数据*/
        for(var i = 0;i < file.files.length; i++){
            formData.append('file',file.files[i]);
        }
        formData.append('title',title);
        formData.append('noteContent',noteContent);
        formData.append('topicsId',2);
        formData.append('time',new Date().getTime());
        formData.append('userId',userInfo[0].userId);

        // formData.append('file',file.files[1]);
        event.preventDefault();

        $.ajax({
            url: '/api/postNotes',
            type: 'post',
            data: formData,
            contentType: false, //不可缺参数
            processData: false, //不可缺参数
            cache: false,
        })
        .done(function(res) {
            console.log(res);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            // net::ERR_CONNECTION_REFUSED 发生时，也能进入
            console.info("网络出错");
        })
        .always(function(){
            location.href='/front/shequ'
        });



    });
})
