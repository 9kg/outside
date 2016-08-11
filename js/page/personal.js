$(function(){
    var $dockForm;
    var box = new Box({
        title: "修改个人信息",
        css: {
            "min-width": "320px",
            "max-width": "420px",
        },
        fnSure: function(that,fn) {
            if (!base.formValidate($dockForm)) {
                return false;
            } else {
                var data = $dockForm.serializeArray();
                data.push({name: "token", value: localStorage.getItem("token")})
                $.ajax({
                    url: "http://es2.laizhuan.com/module/offer1/User/modifyInformation",
                    type: "POST",
                    dataType: "json",
                    data: data
                }).done(function(data){
                    if(data.status == 1){
                        $('.btn_edit').parent().operTip(data.msg || "操作成功！",{theme: "success", css:{"white-space": "nowrap"}});
                        setTimeout(function(){
                            window.location.href = window.location.href;
                        },500);
                    }else if(data.status === -1){
                        $('[data-show=".set_password"]').parent().operTip(data.msg || "未登录！",{theme: "danger", dir: 'top', css:{"white-space": "nowrap"}});
                        setTimeout(function(){
                            location.href = "../common/login.html";
                        },100);
                    }else{
                        $('[data-show=".set_password"]').parent().operTip(data.msg || "操作失败！",{theme: "danger", dir: 'top', css:{"white-space": "nowrap"}});
                        box.show();
                    }
                }).fail(function(e){
                    console.dir(e);
                });
            }
        },
        fnCancel: function(t) {}
    });

    $.ajax({
        url: "http://es2.laizhuan.com/module/offer1/User/information",
        dataType: "json",
        data: {
            token: localStorage.getItem("token")
        }
    }).done(function(data){
        if(data.status === 1){
            renderInfo(data.data);
            box.initContent('../../html/temp/modify_personal.html .modify_personal_form', function() {
                $dockForm = $('form.modify_personal');
                $('[name="name"]').val(data.data.name).before($('<input type="hidden" name="id" value="'+data.data.id+'">'));
            });
        }else if(data.status === -1){
            $('.grid.details').eq(0).operTip(data.msg || "未登录！",{theme: "danger", dir: 'top', css:{"white-space": "nowrap"}});
            setTimeout(function(){
                location.href = "../common/login.html";
            },1500);
        }
    }).fail(function(e){
        console.dir(e);
    });

    // 打开用户信息编辑框
    $("body").on('click', '.btn_edit', function() {
        box.show();
    });

    // 用户信息渲染
    function renderInfo(data){
        $(".data_id").text(data.id);
        $(".data_name").text(data.name);
        $(".data_createdAt").text(data.createdAt);
    }
});