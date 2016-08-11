$(function(){

    // 获取来源数据
    var source_data = {};
    $.ajax({
        url: 'http://es2.laizhuan.com/back/source/query?oper_type=query',
        dataType: "json"
    }).done(function(data){
        if(data.status == 1){
            $.each(data.data,function(i,item){
                source_data[item.id] = item.name;
            });
        }
    });

    // 日期控件的初始化
    var date_start,date_end;
    function afterDomReady(){
        var start_date = base.calDate('i',-(new Date).getMinutes());
        var end_date = base.calDate('y',1,start_date);
        date_start = $(".date_start").val(base.date("y-m-d h:i",start_date)).datepicker({format: 'y-m-d h:i',min: "today",datetime: start_date});
        date_end = $(".date_end").val(base.date("y-m-d h:i",end_date)).datepicker({format: 'y-m-d h:i',min: "today",datetime: end_date});

        // 来源框置为suggest控件
        $('.source_id_ct').suggest({
            key: 'id',
            val: 'name',
            $key_ct: $('[name="source_id"]'),
            $val_ct: $('.source_name'),
            data: source_data
        });
    }

    // 表单提交
    function sendData(afterfnSure){
        var $dockForm = $('form.add_task');
        if (!base.formValidate($dockForm)) {
            return false;
        } else {
            // 获取数据前 禁用选中的'其他'选择框, 避免选到这两个无关数据
            $('[name="price"][data-show]:checked,[name="taskprice"][data-show]:checked').prop('disabled',true);
            var sendData = $dockForm.serializeArray();
            $.ajax({
                url: "test.php",
                type: "POST",
                dataType: "json",
                data: sendData
            }).done(function(){
                afterfnSure && afterfnSure("das");
            }).fail(function(e){
                afterfnSure && afterfnSure();
                console.dir(e);
            });
        }
        return true;
    }
    // 弹框前需要执行的js
    function beforeDialog(){
        // 初始化添加任务弹框
        var box = new Box({
            title: "修改任务edit",
            html: "../../html/temp/add_task.html .add_task_form",
            css: {
                "min-width": "320px"
            },
            fnSure: function(that,fn) {
                if(!sendData(that && that.afterfnSure)){
                    return false;
                };
            },
            fnCancel: function(t) {}
        });
        // 暴露给弹窗主页面的方法
        window.oper_task = {
            box: box,
            afterDomReady: afterDomReady
        };
    }
    // 非弹框时才作日期控件初始化（弹框运行时该段js先于添加任务页面dom渲染前执行）
    if($(".date_start").length){
        afterDomReady();
        $('form.add_task [name="storeurl"]').attr('data-validate-dir','');
    }else{
        beforeDialog();
    };

    // 选择日期后调整对应日期控件的可选范围
    $("body").on("change",'.date_start,.date_end',function(){
        if($(this).is('.date_start')){
            date_end.cgOpt({min: $(this).val()});
        }else{
            date_start.cgOpt({max: $(this).val()});
        }
    }).on("click",'.btn_task_submit',function(){
        // 非弹框时提交
        sendData(function(tip){

        });
    });
});
