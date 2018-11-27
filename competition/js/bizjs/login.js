function login(){
	var userName = $("#userName").val();
	var password = $("#password").val();
	
 	$.ajax({
		url : path + "login_gameLogins.action",
		data : {
			userName: userName,
			userPwd: password
		},
		type : "post",
//		processData:false,
//      contentType:false,
		success : function(data) {
			console.log(data);
			if("success" == data.retCode){
				localStorage.setItem("islogin","1");
//				window.location.href="index.html";
			}else{
				
			}
		}
	});
}
