var datalist;

$(function(){
	datalist = $('#dataGrid');
	initDatagrid();
	
	$('#startDate').datetimepicker({
	     locale: 'zh-cn',
	     viewMode: 'days',
	     format: 'YYYY-MM-DD'
	 });
	 
	 $('#closeDate').datetimepicker({
	     locale: 'zh-cn',
	     viewMode: 'days',
	     format: 'YYYY-MM-DD'
	 });
})

function initDatagrid(){
	var page = 1;
	datalist.bootstrapTable({
	ajax : function (request) {
        $.ajax({
            type : "POST",
            url : path + "order_orderAll.action",
//			contentType: "application/json;charset=utf-8",
//			dataType:"jsonp",
			data:{
				"page": page ? 1 : page,
				"rows": pagesize,
				"orderStat": $("#orderstate").val(),
				"channel":$("#channel").val(),
				"signType": $("#signType").val(),
				"startDate": $("#startDate").val(),
				"closeDate": $("#closeDate").val(),
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
			field: 'actId',
			title: '赛事id',
			visible : false
		},{
			field: 'orderId',
			title: '订单id',
			visible : false
		},{
			field: 'userId',
			title: '用户id',
			visible : false
		},{
			field: 'beginDate',
			title: '开始时间'
		},{
			field: 'channel',
			title: '支付渠道',
			switchable: true,
			sortable: true,
			formatter:function(value){
				let info = "";
				switch(String(value)){
					case"1":
						info = "微信";
						break;
					case"2":
						info = "支付宝";
						break;
				}
				return info;
			}
		}, {
			field: 'endDate',
			title: '结束时间',
			switchable: true
		}, {
			field: 'orderPrice',
			title: '订单金额',
			switchable: true
		}, {
			field: 'orderStat',
			title: '订单状态',
			switchable: true,
			formatter:function(value){
				let info = "";
				switch(String(value)){
					case"1":
						info = "未支付";
						break;
					case"2":
						info = "已支付";
						break;
				}
				return info;
			}
		}, {
			field: 'signType',
			title: '报名类型',
			switchable: true,
			formatter:function(value){
				let info = "";
				switch(String(value)){
					case"1":
						info = "个人";
						break;
					case"2":
						info = "团队";
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
					btns += "onclick='checkorder(&quot;"+row.actId+"&quot;,&quot;"+row.userId+"&quot;)'>";
					btns += "<span class='glyphicon glyphicon-edit'></span> 检查是否可用</button>&nbsp;&nbsp;";
				
				return btns;
			}
		}
],
	})
}

function checkorder(orderId,userId){
	$.ajax({
		url : path + "order_gameOrderCheck.action",
		data:{
//				"orderStat": 1
//				"channel":$("#channel").val(),
//				"signType": $("#signType").val(),
//				"startDate": $("#startDate").val(),
//				"closeDate": $("#closeDate").val(),
			},
		type : "post",
//		processData:false,
//      contentType:false,
		success : function(data) {
			console.log(data);
			layer.msg(data.retMsg);
		}
	  });
}

function exportbtn(){
	 $.ajax({
		url : path + "order_outExcle.action",
		data : {
			"orderStat": 1
		},
		type : "post",
//		processData:false,
//      contentType:false,
		success : function(data) {
			console.log(data);
			
			
//			if("success" == data.retCode){
//				layer.msg("导出成功",{icon:1});
//				layer.close(layer1);
//				search();
//			}else{
//				layer.msg("导出失败",{icon:2});
//			}
		}
	  });
}

//得到查询的参数
function queryParams(params) {
	var orderStat = $("#orderstate").val();
	var channel = $("#channel").val();
	var signType = $("#signType").val();
	var startDate = $("#startDate").val();
	var closeDate = $("#closeDate").val();
	var temp = { 
		limit : params.limit, //pageSize
		offset : params.offset, //pageNo
		orderStat : orderStat,
		channel: channel,
		signType: signType,
		startDate: startDate,
		closeDate: closeDate
	};
	console.log(temp);
	return temp;
}

function search() {
	let startDate = $("#startDate").val();
	let closeDate = $("#closeDate").val();
	if(startDate && closeDate && startDate > closeDate){
		layer.msg("结束时间必须大于开始时间！");
		return;
	}
	datalist.bootstrapTable('refreshOptions',{pageNumber:1});
}

