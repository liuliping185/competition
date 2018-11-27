var path = "http://47.92.219.42:8012/game_web/";
var pagesize = 3000;
var clientWidth = $(window).width();
var clientHeight = $(window).height();
var dialogInstace , onMoveStartId , mousePos = {x:0,y:0};	//	用于记录当前可拖拽的对象

// 获取地址栏参数
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURIComponent(r[2]); return null;
}


function checklogin(){
	if(localStorage.islogin){
		$(".loginbtn").html('<span onclick="signout()">退出</span>');
	}else{
		window.parent.location.href="../login.html";
	}
}

function signout(){
	localStorage.setItem("islogin","");
	window.parent.location.href="../login.html";
}

