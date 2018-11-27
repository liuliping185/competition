var listTmpl;
var datalist;

$(function(){
	 checkform();
	var fileData = leftnav;
//	listTmpl = document.getElementById('list-tmpl').innerHTML;
//	document.getElementById('lefttitlebtn').innerHTML=doT.template(listTmpl)(fileData);
	
	datalist = $('#dataGrid');
	initDatagrid();
	
	$("#mergeDiv").hide();

	
	$('#summernote').summernote({
		width: 700,
        height: 550,
        tabsize: 2,
        lang: 'zh-CN'
    });
    
//  var actdate = $(".actDate").val();
//	  	alert(actdate);
//	  	$(".actDate").val(actdate).change();
    
     $('.actDate').datetimepicker({
	     locale: 'zh-cn',
	     viewMode: 'days',
	     format: 'YYYY-MM-DD'
	 })
})

function time(){
	var t = $("actDate").val();
	$("actDate").val(t).change();
}


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
            				message: '赛事图片不能为空'
            			}
            		}
           },
            actName: {
//              group: '.col-lg-5',
                validators: {
                    notEmpty: {
                        message: '赛事名称不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 30,
                        message: '赛事名称长度必须在1到30位之间'
                    },
                }
            },
            actDate:{
            		trigger:"focus blur keyup change oninput",
//          		group: '.col-lg-5',
            		validators:{
            			notEmpty:{
            				message: '赛事时间不能为空'
            			}
            		}
            },
            actPrice:{
//         	 	group: '.col-lg-5',
           	 	validators:{
           	 		notEmpty: {
                        message: '报名价格不能为空'
                    },
            			digits:{
            				message: '报名价格必须为正整数'
            			}
            		}
            }
//          ,
//          actDesc:{
//         	 	trigger:"focus blur keyup change oninput",
////          		group: '.col-lg-5',
//          		validators:{
//          			required: true,
//          			notEmpty:{
//          				message: '详情内容不能为空'
//          			}
//          		}
//          }
            
        }
    });
}

function actDescchange(){
	var desc = $(".actDesc").val();
	$(".actDesc").val(desc).change();
}

function initDatagrid(){
	var page = 1;
	datalist.bootstrapTable({
	ajax : function (request) {
        $.ajax({
            type : "POST",
            url : path + "act_actAll.action",
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
		columns: [{
			field: "id",
			checkbox:true
		},{
			field: 'actId',//actName 赛事名次；actUrl 赛事封面图片路径 actType (1个人赛 2 团队赛) actState (1进行中 2已结束) actDate 赛事时间 actPrice 赛事报名价格 
			title: '赛事id'
//			visible : false
		},{
			field: 'actName',//actName 赛事名次；actUrl 赛事封面图片路径 actType (1个人赛 2 团队赛) actState (1进行中 2已结束) actDate 赛事时间 actPrice 赛事报名价格 
			title: '赛事名称',
			switchable: true
		}, {
			field: 'actType',
			title: '赛事类型',
			switchable: true,
			formatter:function(value){
				let info = ""; 
				switch(String(value)){
					case"1":
						info = "个人赛";
						break;
					case"2":
						info = "团队赛";
						break;
					default:
						info = "其他赛";
						break;
				}
				return info;
			}
		}, {
			field: 'actState',
			title: '赛事状态',
			switchable: true,
			formatter:function(value){
				console.log("赛事状态",value)
				let info = "";
				switch(String(value)){
					case"1":
						info = "报名中";
						break;
					case"2":
						info = "报名结束";
						break;
					case"3":
						info = "游戏结束";
						break;
					default:
						info = "其他状态";
						break;
				}
				return info;
			}
		}, {
			field: 'remark',
			title: '是否分组',
			switchable: true,
			formatter:function(value){
				let info = "";
				switch(String(value)){
					case"y":
						info = "已分组";
						break;
					default:
						info = "未分组";
						break;
				}
				return info;
			}
		}, {
			field: 'actDate',
			title: '赛事时间',
			switchable: true,
			sortable: true
		}, {
			field: 'actPrice',
			title: '报名价格',
			switchable: true
		}
		, {
			field: 'remark',
			title: '备注',
			visible : false
		}
		, {
			field : 'operation',
			title : '操作',
			width : '30%',
			formatter:function(value,row,index){
				var btns = "";
					btns += "<button name='editBtn' class='btn btn-default btn-xs'";
					btns += "onclick='edit(&quot;"+row.actId+"&quot;,&quot;"+row.actName+"&quot;,&quot;"+row.actType;
					btns += "&quot;,&quot;"+row.actPrice+"&quot;)'>";
					btns += "<span class='glyphicon glyphicon-edit'></span> 编辑</button>&nbsp;&nbsp;";
				if(1==row.actState || 2==row.actState){
					btns += "<button class='btn btn-default btn-xs' onclick='getRegistrationListByActid(&quot;"+row.actId+"&quot;";
					btns += ",&quot;"+row.actState+"&quot;,&quot;"+row.remark+"&quot;,&quot;"+row.actType+"&quot;)'>";
					btns += "<span class='glyphicon glyphicon-cog'></span> 查看报名信息</button>&nbsp;&nbsp;";
				}
				
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
		offset : params.offset, //pageNo
//		actId : $("#search_actId").val()
	};
	console.log(temp);
	return temp;
}

function search() {
	datalist.bootstrapTable('refreshOptions',{pageNumber:1});
}
var layer1 = "";
function add(){
	isempty();
	
	$("font").html("*");
	$('button').blur();
	layer1 = layer.open({
	  title:"新增赛事",
	  type: 1,
	  anim: 0,
	  closeBtn:1,
	  area: ['1000px', '600px'],
	  content: $("#mergeDiv"),
	  scrollbar: false,
	  btn:["确定","取消"],
	  cancel: function(index, layero){
	  	layer.close(layer1);
	  },
	  yes:function(){
	  	time();
	  	var actdesc = $("#summernote").summernote("code");
	  	 $(".actDesc").val(actdesc);
//		  console.log(actdesc);
//		  if(!actdesc){
//		  	layer.msg("详情内容不能为空");
//		  	return;
//		  }
//	  	actDescchange();
		$('#mergeForm').bootstrapValidator('validate');
		if(!$('#mergeForm').data('bootstrapValidator').isValid()){
			return;
		}

		  var form = new FormData(document.getElementById("mergeForm"));
		  $.ajax({
			url : path + "act_addAct.action",
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

function getactInfo(actId){
	$.ajax({
			url : path + "act_searchAct.action",
			data : {
				actId: actId
			},
			type : "post",
//			processData:false,
//          contentType:false,
			success : function(data) {
				console.log(data);
				if("success" == data.retCode){
					var obj = data.obj;
					$(".actDesc").val(obj.actDesc);
					$('#summernote').summernote('code', obj.actDesc);
					$("#actName").val(obj.actName);
					$(".actType").val(obj.actType);
					$(".actState").val(obj.actState);
					$(".actDate").val(obj.actDate);
					$("#actPrice").val(obj.actPrice);
					$(".actCs").val(obj.actCs);
					$("#remark").val(obj.remark);
					if(obj.actUrl){
						$("#actimg").html('<input name="" class="uploadFileName"/><span onclick="closeuploadname()" class="closeuploadname">×</span>');
						$(".uploadFileName").val(obj.actUrl);
					}else{
						$("#actimg").html('<input id="uploadname" type="file" name="upload" onchange="return getuploadname()" style="display:none"><label for="uploadname" class="btn btn-default updatehead">选择图片</label><input name="uploadFileName" class="uploadFileName"/>');
					}
				}else{
				}
			}
		  });
}

function selectFile(){
	$('#uploadname').click();
}

function closeuploadname(){
	$("#actimg").html('<input id="uploadname" type="file" name="upload" onchange="return getuploadname()" style="display:none"><label for="uploadname" class="btn btn-default updatehead">选择图片</label><input name="uploadFileName" class="uploadFileName"/>');
}

function isempty(){
	$(".actDesc").val("");
	$('#summernote').summernote('code', "");
	$("#actName").val("");
//	$(".actType").val("");
//	$(".actState").val("");
//	$(".actDate").val("");
	$(".actPrice").val("");
//	$(".actCs").val("");
}

function edit(id,name,type,remark){
	$('button').blur();
	$(".actId").val(id);
	getactInfo(id);
	
//	$("#name").val(name);
	
	var layer1 = layer.open({
	  title:"编辑角色",
	  type: 1,
	  anim: 0,
	  closeBtn:1,
	  area: ['1000px', '600px'],
	  content: $("#mergeDiv"),
	  scrollbar: false,
	  btn:["确定","取消"],
	  cancel: function(index, layero){
	  	layer.close(layer1);
	  },
	  yes:function(){
	  	time();
	  	  var actdesc = $("#summernote").summernote("code");
//		  alert(actdesc);
		  if(!actdesc){
		  	layer.msg("详情内容不能为空");
		  	return;
		  }
		  $(".actDesc").val(actdesc);
//		  $('#mergeForm').bootstrapValidator('validate');
//			if(!$('#mergeForm').data('bootstrapValidator').isValid()){
//				return;
//			}
		  var form = new FormData(document.getElementById("mergeForm"));
		  console.log(form);
		  $.ajax({
			url : path + "act_upAct.action",
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

function del(){
	var rows = datalist.bootstrapTable('getSelections');
	console.log(rows);
	if(rows.length == 0){
		layer.msg('请选择至少一条记录！', {icon: 0});
		return;
	}
	var actId = rows[0].actId;
//	for (var i = 0; i < rows.length; i++) {
//		ids[i]= rows[i].actId;
//	}
	layer.confirm('确定删除选择的 '+rows.length+' 条记录吗 ？',{icon:3,title:'删除'},function(index){
		var loadIndex = layer.load(1);
		$.ajax({
			url : path + "act_deAct.action",
			data : {
				"actId":actId
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

function getRegistrationListByActid(id,state,remark,actType){
	window.location.href="bizhtml/registrationList.html?actid=" + id + "&state=" +state +"&remark=" + remark + "&actType=" + actType;
}



function sendFile(files, editor, $editable) {  
        
        var size = files[0].size;
        if((size / 1024 / 1024) > 2) {
            alert("图片大小不能超过2M...");
            return false;
        }
        
        var data = new FormData();  
        data.append("ajaxTaskFile", files[0]);  
        
        var hdnContextPath = $("#hdnContextPath").val();
        
        $.ajax({  
            data : data,  
            type : "POST",  
            url : hdnContextPath + "/file/upload.action",    // 图片上传出来的url，返回的是图片上传后的路径，http格式  
            cache : false,  
            contentType : false,  
            processData : false,  
            dataType : "json",  
            success: function(data) {//data是返回的hash,key之类的值，key是定义的文件名  
            
                $.each(data.data, function (index, file) {
                    $('#summernote').summernote('insertImage', file.url);  
                }); 
                
            },  
            error:function(){  
                alert("上传失败");  
            }  
        });  
    }  
    
    function getuploadname() {
    		var fileObj = document.getElementById("uploadname").files[0].name; //drag上传
    		
    		$(".uploadFileName").val(fileObj).change();
    		
//  		$("#actimg").html('<input id="uploadname" type="file" name="upload" onchange="return getuploadname()" style="display:none"><label for="uploadname" class="btn btn-default updatehead">选择图片</label><input name="uploadFileName" class="uploadFileName" value="' +fileObj+ '"/>');
		
		console.log(fileObj);
	}

