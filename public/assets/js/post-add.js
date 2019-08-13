$.ajax({
	url: '/categories',
	type: 'get',
	success: function (response) {
        
        //拼接模板，显示在页面
		var html = template('categoryTpl', {data: response});
		$('#category').html(html);
	}
});
$('#feature').on('change',function(){
    //获取管理员选择到的文件 不管用户上传多少文件都存储在files
    var file = this.files[0];
    console.log(file);
    
    var formData = new FormData();
    //将管理员选择到的文件追加到formData 对象中
    formData.append('cover',file);
    $.ajax({
        type:'post',
        url:'/upload',
        data:formData,
        //阻止参数数据的处理；
        processData:false,
        contentType:false,
        success:function(res){
          
            
            $('#thumbnail').val(res[0].cover);
            $('.thumbnail').attr('src',res[0].cover).show();
        }
    });
    $('')
});
$('#addForm').on('submit',function(){
    //获取管理员在表单中输入的内容；
    var formData = $(this).serialize();
    //服务器发送请求文章添加

    $.ajax({
        type:'post',
        url:'/posts',
        data:formData,
        success:function(){
            //文章添加成功 跳转到文章列表页面；
            location.href ='/admin/posts.html'
        }
    })
    return false;
})