var datalist;

$(function(){
	datalist = $('#dataGrid');
	initDatagrid();
})

function initDatagrid(){
	var page = 1;
	
	datalist.bootstrapTable({
	ajax : function (request) {
        $.ajax({
            type : "POST",
            url : path + "user_gameuserAll.action",
//			contentType: "application/json;charset=utf-8",
//			dataType:"jsonp",
			data:{
				"page": page ? 1 : page,
				"rows": pagesize,
				"telephone": $("#search_actName").val()
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
			field: 'userName',
			title: '用户名称',
			switchable: true,
		},{
			field: 'telephone',
			title: '联系方式',
			switchable: true,
			sortable: true
		}, {
			field: 'userDate',
			title: '创建时间',
			switchable: true
		}
],
	})
}

//得到查询的参数
function queryParams(params) {
	var telephone = $("#search_actName").val();
	var temp = { 
		limit : params.limit, //pageSize
		offset : params.offset, //pageNo
		telephone : telephone
	};
	console.log(temp);
	return temp;
}

function search() {
	datalist.bootstrapTable('refreshOptions',{pageNumber:1});
}





