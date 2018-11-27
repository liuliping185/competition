var actid = GetQueryString("actid");
var state = GetQueryString("state");
var remark = GetQueryString("remark");
var type = GetQueryString("actType");
var datalist;

$(function(){
	datalist = $('#dataGrid');
	initDatagrid();
	console.log(state,remark);
	$(".actId").val(actid);
	
})

function checklength(list){
	console.log(state);
	var flag = 1;
	var result = 0;
	if(list.length < 2){
		return result;
	}else{
		var teamname = list[0].signTeamname;
	    list.forEach(function(i){
	    		if(teamname != i.signTeamname){
	    			flag ++;
	    		}
	    })
	    
	    if(1 == type){
	    		result = list.length;
	    	
	    		return result;
	    }else{
	    		return flag;
	    }
		
	}
}

function initDatagrid(){
	
	var page = 1;
	datalist.bootstrapTable({
	ajax : function (request) {
        $.ajax({
            type : "POST",
            url : path + "sign_signList.action",
//			contentType: "application/json;charset=utf-8",
//			dataType:"jsonp",
			data:{
				"page": page === undefined ? 1 : page,
				"rows": pagesize,
				"actId": actid
			},
			jsonp:'callback',
            success : function (msg) {			
				request.success({
                    row : msg
                });
                var check = checklength(msg.list);
                console.log(check);
                
//              $("#signTeamname").val(msg.list[0].signTeamname);

				if(2 == state && remark && 2 == remark && check > 1){
					$(".group").html('<div id="btn">分组</div>');
				}
                
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
			field: 'actId',//actName 赛事名次；actUrl 赛事封面图片路径 actType (1个人赛 2 团队赛) actState (1进行中 2已结束) actDate 赛事时间 actPrice 赛事报名价格 
			title: '赛事名次',
			visible : false
		},{
			field: 'signCard',//actName 赛事名次；actUrl 赛事封面图片路径 actType (1个人赛 2 团队赛) actState (1进行中 2已结束) actDate 赛事时间 actPrice 赛事报名价格 
			title: '报名编号',
			switchable: true,
			sortable: true
		}, {
			field: 'signName',
			title: '报名者',
			switchable: true
		}, {
			field: 'signDate',
			title: '报名时间',
			switchable: true
		}, {
			field: 'signTel',
			title: '联系方式',
			switchable: true
		}, {
			field: 'signType',
			title: '报名类型',
			switchable: true
		}, {
			field: 'signRandom',
			title: '所在组',
			switchable: true
		}
		, {
			field: 'remark',
			title: '备注',
			formatter:function(value){
				var info = "";
				value = 2? info = "报名成功" : "报名中";
				return info;
			}
//			visible : false
		}
//		, {
//			field : 'operation',
//			title : '操作',
//			width : '30%',
//			formatter:function(value,row,index){
//				var btns = "";
//					btns += "<button name='editBtn' class='btn btn-default btn-xs'";
//					btns += "onclick='edit(&quot;"+row.actId+"&quot;,&quot;"+row.actName+"&quot;,&quot;"+row.actType;
//					btns += "&quot;,&quot;"+row.actPrice+"&quot;)'>";
//					btns += "<span class='glyphicon glyphicon-edit'></span> 编辑</button>&nbsp;&nbsp;";
//				return btns;
//			}
//		}
],
	})
}

//得到查询的参数
function queryParams(params) {
	
	var temp = { 
		limit : params.limit, //pageSize
		offset : params.offset, //pageNo
		actId : actid
	};
	console.log(temp);
	return temp;
}

function grouping(){
	$.ajax({
		url : path + "sign_upSignRandom.action",
		data : {
			actId: actid
//			signTeamname: $("#signTeamname").val()
		},
		type : "post",
//		processData:false,
//      contentType:false,
		success : function(data) {
			console.log(data);
			$(".group").html('');
			layer.msg(data.retMsg);
//			if("success" == data.retCode){
//				layer.msg("修改成功",{icon:1});
//				layer.close(layer1);
//				search();
//			}else{
//				layer.msg("修改失败",{icon:2});
//			}
		}
	});
}


