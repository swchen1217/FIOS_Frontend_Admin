var user;

function init() {
    if ($.cookie('access_token') != undefined) {
        user = jwt_decode($.cookie('access_token'))['user'];
        $('#btn_login').text(user['name'] + "/登出");
    } else
        $('#btn_login').text("登入");

    PermissionStr = [];

    $('#table_dish').bootstrapTable({
        dataType: "json",
        classes: "table table-bordered table-striped table-sm",
        striped: true,
        pagination: true,
        uniqueId: 'id',
        sortName: 'id',
        pageNumber: 1,
        pageSize: 5,
        search: true,
        showPaginationSwitch: true,
        detailView:true,
        columns: [{
            field: 'id',
            title: 'ID',
            //formatter: LinkFormatterCM
        }, {
            field: 'name',
            title: '名稱'
        }, {
            field: 'manufacturer_name',
            title: '供應商'
        }, {
            field: 'price',
            title: '售價'
        }, {
            field: 'rating',
            title: '評分'
        }, {
            field: 'ratiupdated_atng',
            title: '修改時間'
        }, {
            field: 'photo_show',
            title: '圖片',
            width: 70,
            formatter: '<button id="btn_show_photo" class="btn btn-info">圖片</button>'
        }, {
            field: 'sale',
            title: '販售',
            width: 70,
            formatter: '<button id="btn_sale" class="btn btn-primary">販售</button>',
        }]
    });
}

function OnHashchangeListener() {
    var hash = location.hash;
    if (hash != '') {
        $("#mNav .nav").find(".active").removeClass("active");
        $("a[href='" + hash + "']").parent().addClass('active');
    }
    $("div[id^='Content_']").hide();
    $("#title_bar").show();
    HideAlert();

    if (hash == '') {
        $('#Content_Home').show();
    }
    if (hash == '#DishManage' && login_check() && PermissionCheck(false, true)) {
        $('#Content_DishManage').show();
        $("#title_bar").hide();

        $('#table_dish').bootstrapTable('load', getDishList());
    }
    if (hash == '#SaleManage' && login_check() && PermissionCheck(false, true)) {
        $('#Content_SaleManage').show();
        $("#title_bar").hide();
    }
    if (hash == '#OrderManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_OrderManage').show();
        $("#title_bar").hide();
    }
    if (hash == '#BalanceManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_BalanceManage').show();
        $("#title_bar").hide();
    }
    if (hash == '#SystemSetting' && login_check() && PermissionCheck(true, true)) {
        $('#Content_SystemSetting').show();
        $("#title_bar").hide();
    }
    if (hash == '#UserManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_UserManage').show();
        $("#title_bar").hide();

        /*$('#table_user').bootstrapTable('load', getUsers(true));

        var getURl = new URL(location.href);
        if (getURl.searchParams.has('acc')) {
            var acc = getURl.searchParams.get('acc');
            var users = getUsers(false);
            var userinfo;
            for (let i = 0; i < users.length; i++) {
                if (users[i]['account'] == acc) {
                    userinfo = users[i];
                    break;
                }
            }
            if (userinfo != undefined) {
                $('#chguser-ShowAcc').val(userinfo['account']);
                $('#chguser-ShowName').val(userinfo['name']);
                $('#chguser-ShowPermission').val(userinfo['isAdmin']);
                $('#chguser-ShowClass').val(userinfo['class']);

                setClassCheck();
            }
        }*/
    }
    if (hash == '#ChangePW') {
        $('#Content_ChangePW').show();
    }
}

function login_check() {
    if ($.cookie('access_token')) {
        return true;
    } else {
        ShowAlart('alert-danger', '尚未登入!!', false, false);
        return false;
    }
}

function PermissionCheck(needAdmin, isAlert) {
    HideAlert();
    /*var hasAdmin = $.cookie("LoginInfoAdmin");
    if ((needAdmin && hasAdmin == '1') || needAdmin != true) {
        console.log("Pass");
        return true;
    } else {
        console.log("NoPass");
        if (isAlert) {
            ShowAlart('alert-warning', "您的權限不足!!", false, false);
        }
        return false;
    }*/
    return true;
}

window.operateEvents = {
    // e      Event
    // value  undefined
    // row    rowdata
    // index  row
    'click #btn_': function (e, value, row, index) {

    }
};

function FormSubmitListener() {
    $('#form-').submit(function () {

        return false;
    });
}

function ButtonOnClickListener() {
    $('#btn_').click(function () {

    });
}

function getDishList() {
    var res = request('GET','/dish');
    if(res.code==404){
        $.alert({
            title: '錯誤',
            content: '找不到!!',
            type: 'red',
            typeAnimated: true
        });
    }
    return res.data;
}
