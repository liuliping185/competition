var datalist;

$(function(){
	checkform();
	datalist = $('#dataGrid');
	initDatagrid();
	$("#liveStat").hide();
})

function checkform(){
 	$('#mergeForm').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
　　　　　　 invalid: 'glyphicon glyphicon-remove',
　　　　　　 validating: 'glyphicon glyphicon-refresh'
        },
        excluded:[":disabled"],
        fields: {
	        	uploadFileName:{
	        			trigger:"focus blur keyup change oninput",
	//      			group: '.col-lg-5 .col-lg-3',
	            		validators:{
	            			notEmpty:{
	            				message: '头像图片不能为空'
	            			}
	            		}
	          },
            link: {
            		validators: {
            			notEmpty: {
                        message: '轮播地址不能为空'
                    },
                    regexp:{
				       regexp:/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/,
				       message:'轮播地址格式不正确'
				      }
				    },
				    stringLength: {
                        min: 0,
                        max: 100,
                        message: '轮播地址长度必须在1到100位之间'
                    },
                }
            }
    });
}

function initDatagrid(){
	var page = 1;
	datalist.bootstrapTable({
	ajax : function (request) {
        $.ajax({
            type : "POST",
            url : path + "banner_bannerAll.action",
//			contentType: "application/json;charset=utf-8",
//			dataType:"jsonp",
			data:{
				"page": page === undefined ? 1 : page,
				"rows": pagesize
			},
			jsonp:'callback',
            success : function (msg) {			
				request.success({
                    row : msg
                });
                
                console.log(msg);
                $('#dataGrid').bootstrapTable('load', msg.list);
            },
			error:function(){
				alert("错误");
			}
        });
	},
		
		contentType: "application/x-www-form-urlencoded",
		toolbar : '#toolbar',
		singleSelect : false,
		clickToSelect : false, //是否启用点击选中行
		striped : true, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true
		pagination : true, //是否显示分页
		queryParams : queryParams, //传递参数
		sidePagination : 'client', //分页方式：client客户端分页，server服务端分页
		pageSize : 10, //每页的记录行数
		pageList : [ 5, 10, 20, 50 ], //可供选择的每页的行数
		columns: [
//		{
//			field: "id",
//			checkbox:true
//		},
		{
			field: 'bannerId',//
			title: '直播id',
			visible : false
		},{
			field: 'link',//actName 赛事名次；actUrl 赛事封面图片路径 actType (1个人赛 2 团队赛) actState (1进行中 2已结束) actDate 赛事时间 actPrice 赛事报名价格 
			title: '轮播链接',
			switchable: true,
			sortable: true
		}, {
			field: 'type',
			title: '轮播类型',
			switchable: true,
			formatter:function(value){
				var info = "";
				switch(String(value)){
					case"1":
						info = "英雄联盟";
						break;
					case"2":
						info = "王者荣耀";
						break;
					case"3":
						info = "绝地求生";
						break;
					case"4":
						info = "炉石传说";
						break;
					case"5":
						info = "实况足球";
						break;
				}
				
				return info;
			}
		}, {
			field: 'status',
			title: '轮播状态',
			switchable: true,
			formatter:function(value){
				var info = "";
				switch(String(value)){
					case"1":
						info = "启用";
						break;
					case"2":
						info = "禁用";
						break;
				}
				
				return info;
			}
		}, {
			field: 'description',
			title: '描述',
			switchable: true
		}, {
			field: 'imagepath',
			title: '图片名称',
			switchable: true,
			visible : false,
			formatter:function(value){
				var info = "";
				value ? info = value : info = ""
				return info;
			}
		}, {
			field : 'operation',
			title : '操作',
			width : '30%',
			formatter:function(value,row,index){
//				id,description,type,headurl,status,link
				var btns = "";
					btns += "<button name='editBtn' class='btn btn-default btn-xs'";
					btns += "onclick='edit(&quot;"+row.bannerId+"&quot;,&quot;"+row.description+"&quot;,&quot;"+row.type;
					btns += "&quot;,&quot;"+row.imagepath+"&quot;,&quot;"+row.status+"&quot;,&quot;"+row.link+"&quot;)'>";
					btns += "<span class='glyphicon glyphicon-edit'></span> 编辑</button>&nbsp;&nbsp;";
				
				return btns;
			}
		}
],
	})
}

//得到查询的参数
function queryParams(params) {
	
	var temp = { 
		limit : params.limit, //pageSize
		offset : params.offset //pageNo
//		actId : actid
	};
	console.log(temp);
	return temp;
}

var layer1 = "";
function add(){
	$('button').blur();
	$('font').html("*");
	isempty();
	layer1 = layer.open({
	  title:"新增轮播",
	  type: 1,
	  anim: 0,
	  closeBtn:1,
	  area: ['600px', '500px'],
	  content: $("#mergeDiv"),
	  scrollbar: false,
	  btn:["确定","取消"],
	  cancel: function(index, layero){
	  	layer.close(layer1);
	  },
	  yes:function(){
//		  var loadIndex = layer.load(1);

		$('#mergeForm').bootstrapValidator('validate');
		if(!$('#mergeForm').data('bootstrapValidator').isValid()){
			return;
		}
		  var form = new FormData(document.getElementById("mergeForm"));
		  $.ajax({
			url : path + "banner_addBanner.action",
			data : form,
			type : "post",
			processData:false,
            contentType:false,
			success : function(data) {
				console.log(data);
				if("success" == data.retCode){
					layer.msg("保存成功",{icon:1});
					layer.close(layer1);
					search();
				}else{
					layer.msg("保存失败",{icon:2});
				}
			}
		  });
	  },
	  btn2:function(){
		 layer.close(layer1);
	  }
	});
}

function isempty(){
	$("#liveName").val("");
	$("#liveUsername").val("");
	$("#liveLink").val("");
	$("#remark").val("");
	$(".uploadFileName").val("");
}

function edit(id,description,type,headurl,status,link){
	$('button').blur();
	$(".bannerId").val(id);
	
	console.log(headurl);
	if(headurl && "undefined" != headurl){ //
		console.log("111");
		$("#actimg").html('<input name="" class="uploadFileName"/><span onclick="closeuploadname()" class="closeuploadname">×</span>');
		$(".uploadFileName").val(headurl);
	}else{
		$("#actimg").html('<input id="uploadname" type="file" name="upload" onchange="return getuploadname()" style="display:none"><label for="uploadname" class="btn btn-default updatehead">选择图片</label><input name="uploadFileName" class="uploadFileName"/>');
	}
	
	if(type){
		$("#type").val(type);
	}
	if(status){
		$("#status").val(status);
	}
	if(link){
		$("#liveLink").val(link);
	}
	if(description){
		$("#description").val(description);
	}
	
	var layer1 = layer.open({
	  title:"编辑轮播",
	  type: 1,
	  anim: 0,
	  closeBtn:1,
	  area: ['600px', '500px'],
	  content: $("#mergeDiv"),
	  scrollbar: false,
	  btn:["确定","取消"],
	  cancel: function(index, layero){
	  	layer.close(layer1);
	  },
	  yes:function(){
		  var form = new FormData(document.getElementById("mergeForm"));
		  console.log(form);
		  $.ajax({
			url : path + "banner_upBanner.action",
			data : form,
			type : "post",
			processData:false,
            contentType:false,
			success : function(data) {
				console.log(data);
				if("success" == data.retCode){
					layer.msg("修改成功",{icon:1});
					layer.close(layer1);
					search();
				}else{
					layer.msg("修改失败",{icon:2});
				}
			}
		  });
//		  setTimeout(function(){
//				  $.ajax({
//					url : path+"act_upAct.action",
//					data : form,
//					type : "post",
////					dataType : "json",
//					success : function(result) {
//						console.log(result);
//						layer.close(loadIndex);
//						if(result.success){
//							layer.msg(result.message,{icon:1});
//							layer.close(layer1);
//							search();
//						}else{
//							layer.msg(result.message,{icon:2});
//						}
//					}
//				  });
//			  }
//		  },100);
	  },
	  btn2:function(){
	  	layer.close(layer1);
	  }
	});
}

function selectFile(){
	$('#uploadname').click();
}

function closeuploadname(){
	$("#actimg").html('<input id="uploadname" type="file" name="upload" onchange="return getuploadname()" style="display:none"><label for="uploadname" class="btn btn-default updatehead">选择图片</label><input name="uploadFileName" class="uploadFileName"/>');
}

function del(){
	var rows = datalist.bootstrapTable('getSelections');
	console.log(rows);
	if(rows.length == 0){
		layer.msg('请选择至少一条记录！', {icon: 0});
		return;
	}
	var liveId = rows[0].liveId;
//	for (var i = 0; i < rows.length; i++) {
//		ids[i]= rows[i].actId;
//	}
	layer.confirm('确定删除选择的 '+rows.length+' 条记录吗 ？',{icon:3,title:'删除'},function(index){
		var loadIndex = layer.load(1);
		$.ajax({
			url : path + "live_delLive.action",
			data : {
				"liveId":liveId
			},
			type : "post",
			dataType : "json",
			success : function(result) {
				layer.close(loadIndex);
				console.log(result);
				if ("success" == result.retCode) {
					layer.msg('删除成功！', {icon: 1});
					search();
				} else {
					layer.msg(result.message, {icon: 2});
				}
			}
		});
		layer.close(index);
	});
}

function search() {
	datalist.bootstrapTable('refreshOptions',{pageNumber:1});
}

function getuploadname() {
    	var fileObj = document.getElementById("uploadname").files[0].name; //drag上传
    	if(fileObj){
    		$(".uploadFileName").val(fileObj).change();
	//  	$("#actimg").html('<input id="uploadname" type="file" name="upload" onchange="return getuploadname()" style="display:none"><label for="uploadname" class="btn btn-default updatehead">选择图片</label><input name="uploadFileName" class="uploadFileName" value="' +fileObj+ '"/>');
		console.log(fileObj);
    	}
   
}



