//页面渲染
function render(res) { 
  var html = template('pTpl',res);
  $('tbody').html(html);
  //获取文章页面分页的数据；
  var page = template('pageTpl',res);
  $('#page').html(page);
 }
  //发送Ajax将服务器给我们数据渲染到模板上面
  $.ajax({
      type:'get',
      url:'/posts',
      success:function(res){
        // console.log(res);
            render(res)
      }
  });
  function formateDate(date){
    //将日期时间字符串转成日期对象;
    date = new Date(date);
    return date.getFullYear() +'-' + (date.getMonth()+1).toString().padStart(2,0) + '-' + date.getDate()
  };
 
  //文章分页,渲染页面的分页功能；
//创建一个分页函数；
function  changePage(page) {  
$.ajax({
        type:'get',
        url:'/posts',
        data:{
            page:page},
        success:function(res){
             
               render(res);

            }
});
}

  //实现分类筛选功能；
$.ajax({
  type:'get',
  url:'/categories',
  success:function(res){
      console.log(res);
      var html = template('categoryTpl',{data:res});
      $('#categoryBox').html(html);
      // console.log(html);
      // console.log('......');
     
  }
});
//表单筛选过滤

$('#filterForm').on('click',function(){
        var formData = $(this).serialize();
        console.log(formData);
        //向服务器端发送请求根据条件索要列表数据
        $.ajax({
          type:'get',
          url:'/posts',
          data:formData,
          success:function(res){

            render(res)
          }
        })  
});


