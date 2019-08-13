//从浏览器的地址栏获取查询参数
function getUrlParams(name){
    
    var paramsAry = location.search.substr(1).split('&');
    console.log(paramsAry);//拿到当前编辑数据的id值["id=5d503824a8ebb91aa4b41c6b"]
    for(var i =0 ;i<paramsAry.length;i++){
        var tmp=paramsAry[i].split('=');
        if(tmp[0]==name){
            return tmp[1];
        }
    }
    return -1
    
}
var id =getUrlParams('id');