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
	// alert('上传');
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
			//修改用户之后将表单数据还原
			$('#userForm > h2').text('添加新用户');
			$('#hiddenAvatar').val('');
			$('#preview').attr('src','../assets/img/default.png');
			$('#userAdd').show();
			$('#userEdit').hide();
			$('#email').val('');
			$('#nickName').val('');
			$('#admin').prop('checked',false);
			$('#normal').prop('checked',false);
			$('#jh').prop('checked',false);
			$('#wjh').prop('checked',false);



		}
	})
});
//完成单个删除功能;
$('tbody').on('click','.del',function(){
	if(window.confirm('您确定要删除吗?')){
		var id = $(this).parent().attr('data-id');
		$.ajax({
			type:'delete',
			url:'/users/'+id,
			success:function(res){
				var index = userArr.findIndex(item=>item._id==res._id);
				userArr.splice(index,1);
				render((userArr));
			}
		})
	}
});
//实现全选功能 
$('thead input').on('click',function(){
	//选中的框
	// alert('checked........')
	let flag = $(this).prop('checked');
	$('tbody input').prop('checked',flag);
	console.log(flag);
	
	if(flag){
		$('.btn-sm').show();

	}else{
		$('.btn-sm').hide();

	}
});
$('tbody').on('click','input',function(){
	// alert('单选/....');
	if($('tbody input').length==$('tbody input:checked').length){
		$('thead input').prop('checked',true);
		$('.btn-sm').show();
	}else{
		$('thead input').prop('checked',false);
		$('.btn-sm').hide();
	}
	if($('tbody input:checked').length>=2){
		$('.btn-sm').show();
	}else{
		$('.btn-sm').hide();
	}
});
//批量删除按钮
$('.btn-sm').on('click',function(){
	if(window.confirm('您确定要删除吗?')){
	var ids = [];
	var checkUser = $('tbody input:checked');
	//循环数组获得当前的值对应的data-id
	checkUser.each(function(k,v){
		var id = v.parentNode.parentNode.children[6].getAttribute('data-id');
		console.log(id);
		//将id push
		ids.push(id);

	});
	//发送删除请求
	$.ajax({
		type:'delete',
		url:'/users/'+ids.join('-'),
		success:function(res){
			res.forEach(e =>{
				var index =userArr.findIndex(item =>item._id==e._id);
				userArr.splice(index,1);
				console.log(userArr);
				render(userArr);
			})
		}
	})
}
})