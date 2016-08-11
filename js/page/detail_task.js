var id = location.search.slice(4);
$.ajax({
    url: "http://es2.laizhuan.com/module/offer1/ofrtask/taskDetail",
    dataType: "json",
    data: {
        token: localStorage.getItem("token"),
        task_id: id
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

function renderInfo(data){
    $('.data_storeurl').text(data.storeurl);
    $('.data_storeid').text(data.storeid);
    $('.data_name').text(data.name);
    $('.data_price').text(data.price);
    $('.data_countall').text(data.countall);
    $('.data_keyword').text(data.keyword);
    $('.data_keywordTop').text(data.keywordTop);
    $('.data_source_id').text(data.source_id);
    $('.data_affiliate_id').text(data.affiliate_id);
    $('.data_stime').text(data.stime);
    $('.data_expire').text(data.expire);

    $('.data_start_idfa').text(data.start_idfa);
    $('.data_start_idfa_md5').text(data.start_idfa_md5);
    $('.data_start_idfa_true').text(data.start_idfa_true);
    $('.data_start_idfa_false').text(data.start_idfa_false);
    $('.data_start_idfa_localsql').text(+data.start_idfa_localsql ? "是" : "否");
    $('.data_start_click').text(data.start_click);
    $('.data_start_click_md5').text(data.start_click_md5);
    $('.data_start_click_post').text(data.start_click_post);
    $('.data_start_click_true').text(data.start_click_true);
    $('.data_start_click_callback').text(+data.start_click_callback ? "是" : "否");
    $('.tip_isCallback').toggle(!!+data.start_click_callback);
    $('.data_end_click').text(data.end_click);
    $('.data_end_click_md5').text(data.end_click_md5);
    $('.data_end_click_post').text(data.end_click_post);
    $('.data_end_click_true').text(data.end_click_true);
}