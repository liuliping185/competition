var datalist;

$(function(){
	checkform();
	datalist = $('#dataGrid');
	initDatagrid();
	$("#mergeDiv").hide();
	$("#liveStat").hide();
	
	$('#summernote').summernote({
		width: 900,
        height: 550,
        tabsize: 2,
        lang: 'zh-CN'
    });
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
       	  newTitle: {
//              group: '.col-lg-7',
                validators: {
                    notEmpty: {
                        message: '新闻标题不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 40,
                        message: '新闻标题长度必须在1到30位之间'
                    },
                }
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
            url : path + "new_newsAll.action",
//			contentType: "application/json;charset=utf-8",
//			dataType:"jsonp",
			data:{
				"page": page ? 1 : page,
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
			field: 'newId',//actName 赛事名次；actUrl 赛事封面图片路径 actType (1个人赛 2 团队赛) actState (1进行中 2已结束) actDate 赛事时间 actPrice 赛事报名价格 
			title: '新闻id',
			visible : false
		},{
			field: 'newTitle',//actName 赛事名次；actUrl 赛事封面图片路径 actType (1个人赛 2 团队赛) actState (1进行中 2已结束) actDate 赛事时间 actPrice 赛事报名价格 
			title: '新闻标题',
			switchable: true,
			sortable: true
		}, {
			field: 'newType',
			title: '新闻类型',
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
			field: 'remark',
			title: '备注',
			switchable: true
		},{
			field : 'operation',
			title : '操作',
			width : '30%',
			formatter:function(value,row,index){
				var btns = "";
					btns += "<button name='editBtn' class='btn btn-default btn-xs'";
					btns += "onclick='edit(&quot;"+row.newId+"&quot;)'>";
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
	 isempty();
	layer1 = layer.open({
	  title:"新增直播",
	  type: 1,
	  anim: 0,
	  closeBtn:1,
	  area: ['1000px', '600px'],
	  content: $("#mergeDiv"),
	  scrollbar: false,
	  btn:["确定","取消"],
	  cancel: function(index, layero){
	  	layer.close(layer1);
//		  $("#mergeForm").bootstrapValidator('resetForm');
//		  $('#mergeForm')[0].reset();
//		  $("input[name='type'][checked='checked']").prop("checked",false);
	  },
	  yes:function(){
//		  var loadIndex = layer.load(1);

		$('#mergeForm').bootstrapValidator('validate');
		if(!$('#mergeForm').data('bootstrapValidator').isValid()){
			return;
		}
		  var form = new FormData(document.getElementById("mergeForm"));
		  $.ajax({
			url : path + "new_addNews.action",
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
	$("#newTitle").val("");
//	$("#newType").val("");
	$("#liveLink").val("");
	$("#remark").val("");
	$(".newDesc").val($("#summernote").summernote('code',""));
}

function getsNewsInfo(newId){
	$.ajax({
			url : path + "new_newsOne.action",
			data : {
				newId: newId
			},
			type : "post",
			success : function(data) {
				console.log(data);
				if("success" == data.retCode){
					var obj = data.obj;
					$("#newTitle").val(obj.newTitle);
					$("#newType").val(obj.newType);
					$("#liveLink").val(obj.liveLink);
					$("#remark").val(obj.remark);
					$(".newDesc").val($("#summernote").summernote('code',obj.newDesc));
				}else{
				}
			}
		  });
}

function edit(id){
	$('button').blur();
	$(".newId").val(id);
	getsNewsInfo(id);
	
	var layer1 = layer.open({
	  title:"编辑新闻",
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
//	  	  console.log($("#summernote").summernote('code'));
	  	  $(".newDesc").val($("#summernote").summernote('code'));
		  var form = new FormData(document.getElementById("mergeForm"));
//		  console.log(form);
		  $.ajax({
			url : path + "new_upNews.action",
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
	var newId = rows[0].newId;
//	for (var i = 0; i < rows.length; i++) {
//		ids[i]= rows[i].actId;
//	}
	layer.confirm('确定删除选择的 '+rows.length+' 条记录吗 ？',{icon:3,title:'删除'},function(index){
		var loadIndex = layer.load(1);
		$.ajax({
			url : path + "new_delNews.action",
			data : {
				"newId":newId
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

