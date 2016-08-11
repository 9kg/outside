$(function() {
    var baseUrl = "http://es2.laizhuan.com/module/offer1/";
    var urls = {
        task_list: baseUrl+"ofrtask/getTaskList",           // 任务列表地址
        change_status: baseUrl+'ofrtask/changeStatus',      // 改变任务状态地址
        dialog_task: baseUrl+"ofrtask/getUnputTaskList",    // 弹框任务列表地址
        dialog_channel: baseUrl+"user/showAffiliate",       // 弹框渠道列表地址
        import_task: baseUrl+'ofrtask/copyTask'             // 导入任务地址
    };

    // 是否存在弹出框表格
    var exit_sel_table = false;
    // 定义任务列表表格、弹出框任务表格、弹出框渠道表格
    var task_table,sel_task_table,sel_channel_table;
    // 初始化导入任务弹出框
    var sel_task = new Box({
        title:"导入任务",
        html: "../../html/temp/import_task.html .import_task_ct",
        css:{
            'width': '1000px'
        },
        fnSure: function(t){
            var task_val = $('[name="radio_task"]:checked').val();
            var channel_val = $('[name="radio_channel"]:checked').val();
            if(!task_val){
                $('.oper_tip_ct').operTip("请选择一个任务！",{theme:"danger",dir:'bottom'});
                return false;
            }
            if(!channel_val){
                $('.oper_tip_ct').operTip("请选择一个渠道！",{theme:"danger",dir:'bottom'});
                return false;
            }
            import_task(task_val, channel_val);
        },
        fnCancel: function(t){
            console.dir(t);
        }
    });
    // 表格主题与状态值对应关系
    var obj = {
        '-2': 'gray',
        '-1': 'warning',
        '1': 'info',
        '2': 'success'
    };
    // 配置任务表格参数并初始化
    var opt = {
        $ct: $(".content"),
        theme: 'warning',
        isLocal: true,
        footerFix: true,
        url: urls.task_list,
        sendData: {
            sort: 'id',
            sort_dir: 'desc',
            cur_page: 1,
            task_status: -1,
            token: localStorage.getItem("token")
        },
        col: [
            {
                key: "id",
                title: '<label class="checkbox"><input type="checkbox" name="sel_task_all"><span class="opt_imitate"></span></label>',
                width: 20,
                render: function(a, b) {
                    var btn_query = $('<label class="checkbox"><input type="checkbox" value="'+b+'" name="sel_task"><span class="opt_imitate"></span></label>');
                    a.append(btn_query);
                }
            }, {
                key: "id",
                title: "id",
                sort: false,
                filter: true
            }, {
                key: "name",
                title: "名称",
                sort: true,
                filter: true,
                cls: "hidden_xs"
            }, {
                key: "keyword",
                title: "关键词",
                sort: false,
                filter: true,
                cls: "hidden_md"
            }, {
                key: "countall",
                title: "数量",
                sort: false,
                filter: true
            }, {
                key: "id",
                title: "操作",
                width: 60,
                cls: "t_center",
                render: function(a, b) {
                    var status = +$('[name="task_status"]:checked').val();
                    var btn_query = '<button type="button" class="btn btn_info btn_query" data-id="' + b + '">查看</button>';
                    // status === -1 && (btn_query += '<button type="button" class="btn btn_warning btn_modify" data-id="' + b + '">修改</button>');
                    // (status === 1) && (btn_query += '<button type="button" class="btn btn_danger btn_pause" data-id="' + b + '">暂停</button>');
                    // Math.abs(status) === 1 && (btn_query += '<button type="button" class="btn btn_stop" data-id="' + b + '">结束</button>');
                    a.append($(btn_query));
                }
            }
        ]
    };

    task_table = new Table(opt);

    var role = +localStorage.getItem('role');
    if(role !== 1 && role !== 5 && role !== 7){
        $(".btn_start,.btn_pause,.btn_stop,.import_task").remove();
    }
    // 向后台发送需要改到的状态
    function sendStatus(status,id){
        $.ajax({
            url: urls.change_status,
            dataType: 'json',
            type: 'POST',
            data: {
                task_status: status,
                task_id: id,
                token: localStorage.getItem("token")
            }
        }).done(function(data){
            console.dir(data);
            task_table.data = null;
            task_table.render();
        }).fail(function(e){
            console.dir(e);
        });
    }

    // 打开导入任务弹框
    function open_dialog_import_task(){
        sel_task.show();
        var opt = {
            $ct: $(".sel_task"),
            sendData: {
                token: localStorage.getItem("token")
            },
            col: [{
                key: "id",
                width: 20,
                render: function(a, b) {
                    var btn_query = $('<label class="radio"><input type="radio" value="'+b+'" name="radio_task"><span class="opt_imitate"></span></label>');
                    a.append(btn_query);
                }
            }, {
                key: "id",
                title: "ID",
                sort: true,
                filter: true
            }, {
                key: "name",
                title: "名称",
                sort: false,
                filter: true
            }, {
                key: "countall",
                title: "数量",
                sort: true,
                filter: true
            }],
            isLocal: true,
            theme: 'lightblue',
            url: urls.dialog_task
        };
        var opt2 = {
            $ct: $(".sel_channel"),
            sendData: {
                token: localStorage.getItem("token")
            },
            col: [{
                key: "id",
                width: 20,
                render: function(a, b) {
                    var btn_query = $('<label class="radio"><input type="radio" value="'+b+'" name="radio_channel"><span class="opt_imitate"></span></label>');
                    a.append(btn_query);
                }
            }, {
                key: "id",
                title: "ID",
                sort: true,
                filter: true
            }, {
                key: "name",
                title: "名称",
                sort: false,
                filter: true
            }],
            isLocal: true,
            theme: 'warning',
            url: urls.dialog_channel
        };
        if(exit_sel_table){
            sel_task_table.render();
            sel_channel_table.render();
        }else{
            sel_task_table = new Table(opt);
            sel_channel_table = new Table(opt2);
            exit_sel_table = true;
        }
    }

    //导入任务
    function import_task(task_val, channel_val){
        $.ajax({
            url: urls.import_task,
            dataType: 'json',
            type: 'POST',
            data: {
                o_task_id: task_val,
                affiliate_id: channel_val,
                token: localStorage.getItem("token")
            }
        }).done(function(data){
            if(data.status === 1){
                $.each(sel_task_table.data,function(i,item){
                    if(item.id === task_val){
                        sel_task_table.data.splice(i,1);
                        return false;
                    }
                });
                sel_task_table.render();
                task_table.render();
            }
        }).fail(function(e){
            console.dir(e);
        });
    }

    // 状态改变的对应的切换（1.该状态下应该存在的按钮 2.发送给后台的状态参数,重置当前页为第一页 3.表格样式主题）并渲染表格
    function changeStatus(status){
        $('.btn_pause').toggleClass('hidden',status !== 1);
        $('.btn_stop').toggleClass('hidden',status !== -1 && status !==1);
        $('.btn_start').toggleClass('hidden',status !== -1);
        task_table.sendData.task_status = status;
        task_table.sendData.cur_page = 1;
        task_table.theme = obj[status];
        // 不是待处理及进行中的状态下无操作栏及复选框栏
        task_table.data = null;
        task_table.col[0].show = Math.abs(status) === 1;
        task_table.render();
    };

    //事件
    $('body').on('click','.content>.table tbody tr',function(e){
        // 行点击 选中复选框
        if(!$(e.target).is('.btn,.opt_imitate,[type="checkbox"]')){
            $(this).find('[type="checkbox"]').trigger("click");
        }
    }).on('click','.table_min tr',function(e){
        // 行点击时选中单选按钮
        var $radio = $(this).find('.radio [type=radio]');
        if(!$radio.is($(e.target))){
            $radio.trigger("click");
        }
    }).on('click','[name="task_status"]',function(){
        changeStatus(+$(this).val());
    }).on("click", ".import_task", function() {
        open_dialog_import_task();
    }).on("click", ".btn_start,.btn_pause,.btn_stop", function() {
        var status;
        if($(this).is('.btn_start')){
            status = 1;
        }else if($(this).is('.btn_pause')){
            status = -1;
        }else if($(this).is('.btn_stop')){
            status = -2;
        }
        var id = $(this).data("id");
        if(!id){
            id = $('[name="sel_task"]:checked').map(function(i,item){
                return $(item).val();
            }).toArray().join();
        }
        sendStatus(status,id);
    }).on("click", ".btn_query", function() {
        var id = $(this).data("id");
        window.open("../temp/detail_task.html?id="+id);
    });
});
