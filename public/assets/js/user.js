// 主要是用于操作用户的 
var userArr = new Array();
// 将用户列表展示出来 
$.ajax({
    type:'get',
    url:'/users',
    success:function(res){
        userArr = res;
        render(userArr);
    }
})
// 用于调用template方法 
function render(arr){   
	var str =  template('userTpl',{
		 data:arr
	 });
	 // console.log(str);
	 $('tbody').html(str);
 }

// 添加用户功能 //button按钮实现添加功能
$('button').on('click',function(){
	alert('上传');
    // console.log($('#userForm').serialize());
    $.ajax({
        url:'/users',
        type:'post',
        data:$('#userForm').serialize(),
        success:function(res){
			// console.log(res);
			
            userArr.push(res);
			render(userArr);
			
        }
    });
});
//图片上传功能
$('#avatar').on('change',function(){
	var formData = new FormData();
	formData.append('avatar',this.files[0])
	// console.log($(this).files[0]);
	$.ajax({
		type:'post',
		url:'/upload',
		data:formData,
		processData:false,
		contentType:false,
		success:function(res){
			$('#preview').attr('src',res[0].avatar);
			$('#hiddenAvatar').val(res[0].avatar);
		}
	})
});
//编辑用户功能;
var userId
$('tbody').on('click','#edit',function(){
	
	//保存当前被修改的id
	userId = $(this).parent().attr('data-id');

	$('#userForm > h2').text('修改用户');
	var trObj = $(this).parents('tr');
	//先获取图片的地址
	console.log(trObj);
	
	var imgSrc = trObj.children().eq(1).children('img').attr('src');
	console.log(imgSrc);
	
	//将图片的地址写入到隐藏域;
	$('#hiddenAvatar').val(imgSrc);
	//如果imgSrc有值 我们
	if (imgSrc){
		$('#preview').attr('src',imgSrc);
		//
	}else{
		$('#preview').attr('src',"../assets/img/default.png");

	}
	//将对应的内容写入到左边的输入框里面
	$('#email').val(trObj.children().eq(2).text());
	$('#nickName').val(trObj.children().eq(3).text());

	var status = trObj.children().eq(4).text();
	if(status =='激活'){
		$('#jh').prop('checked',true);
	}else{
		$('#wjh').prop('checked',true);

	}
	var role = trObj.children().eq(5).text();
	if(role=='超级管理员'){
		$('#admin').prop('checked',true)
	}else{
		$('#normal').prop('checked',true)

	};
	$('#userAdd').hide();
	$('#userEdit').show();
});
//完成用户的修改功能;
$('#userEdit').on('click',function(){
	$.ajax({
		type:'put',
		url:'/users/'+userId,
		data:$('#userForm').serialize(),
		success:function(res){
			var index = userArr.findIndex(item =>item._id==userId);
			userArr[index]=res;
			render(userArr);
		}
	})
})