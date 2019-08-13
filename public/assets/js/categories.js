// 主要是用于操作用户的 
var cArr = new Array()

$.ajax({
  type: 'get',
  url: '/categories',
  success: function (res) {
    cArr = res;
    render(cArr);
  }
})

// 用于调用template方法 
function render(arr) {
  var str = template('cTpl', {
    data: arr
  });
  // console.log(str);
  $('tbody').html(str);
};

//点击添加按钮添加目录内容;
$('#cAdd').on('click', function () {
  $.ajax({
    type: 'post',
    url: '/categories',
    data: $('#cForm').serialize(),
    success: function (res) {
      cArr.push(res);
      render(cArr);
    }
  })
});
//点击修改按钮修改当前的文章标题;
//编辑用户功能;
var cId
$('tbody').on('click', '.btn-info', function () {

  //保存当前被修改的id
  cId = $(this).parent().attr('data-id');
  $('#cForm > h2').text('修改分类');
  //修改按钮显示,编辑按钮隐藏
  $('#cAdd').hide();
  $('#cEdit').show();
  $.ajax({
    type: 'get',
    url: '/categories/' + cId,
    success: function (res) {
      $('#categoryName').val(res.title);
      $('#icon').val(res.className);
      console.log(res);
    }
  })
});
//确认分类修改操作;
$('#cEdit').on('click', function () {
  $.ajax({
    type:'put',
    url: '/categories/' + cId,
    data: $('#cForm').serialize(),
    success: function (res) {
      //拿到当前要修改的那条数据 在数组中找到这条数据的下标 将这条数据替换掉数组里面的那一条数据
      let index = cArr.findIndex(item => item._id == cId);
      console.log(cId);
      cArr[index] = res;
      render(cArr);
      //表单里面的数据清空;
      $('#categoryName').val('');
      $('#icon').val('');
      $('h2').text('添加分类');
      //隐藏添加 显示编辑
      $('#cAdd').show();
      $('#cEdit').hide();
    }
  })
})
//点击删除按钮
$('tbody').on('click', '.del', function () {

    // alert('删除>>>>>>')
      //保存当前被修改的id
      if(window.confirm('您确定要删除吗?')){
        var id = $(this).parent().attr('data-id');
        $.ajax({
          type:'delete',
          url:'/categories/'+id,
          success:function(res){
            var index = cArr.findIndex(item=>item._id==res._id);
            cArr.splice(index,1);
            render((cArr));
          }
        })
      }
});

//添加多选框选择删除按钮的实现
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
   // console.log(v);
    //从input框开始找爸爸的爸爸就是tr ,tr下的第4个孩子就是索引是[3]找到有data-id
		var id = v.parentNode.parentNode.children[3].getAttribute('data-id');
	
		//将id push
    ids.push(id);
    //console.log(ids);//["5d4f8c5945e39c39c46a0622", "5d4f8c5e45e39c39c46a0623"]
    
    //console.log('...................');
    

	});
	//发送删除请求
	$.ajax({
    type:'delete',
    //把id用-连接起来；
		url:'/categories/'+ids.join('-'),
		success:function(res){
			res.forEach(e =>{
				var index =cArr.findIndex(item =>item._id==e._id);
			cArr.splice(index,1);
				console.log(cArr);
				render(cArr);
			})
		}
	})
}
})