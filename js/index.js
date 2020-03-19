var user;

function init() {
    if ($.cookie('access_token') != undefined)
        user = jwt_decode($.cookie('access_token'))['user'];

    $('#balance-account_input').keypress(function (e) {
        var key = e.which;
        if (key == 13) {
            $('#btn_balance_query').click();
            return false;
        }
    });

    PermissionStr = [];

    $('#table_dish').bootstrapTable({
        dataType: "json",
        classes: "table table-bordered table-striped table-sm",
        striped: true,
        pagination: true,
        sortable: true,
        uniqueId: 'id',
        sortName: 'id',
        pageNumber: 1,
        pageSize: 5,
        search: true,
        showPaginationSwitch: true,
        detailView: true,
        detailFormatter: function (index, row) {
            console.log(row);
            var html =
                '<div class="row" style="margin: 0px;padding: 0px 55px">' +
                '<div class="col-6">' +
                '<p><b>熱量: </b>' + row['calories'] + ' Kcal</p>' +
                '<p><b>蛋白質: </b>' + row['protein'] + ' g</p>' +
                '<p><b>脂肪: </b>' + row['fat'] + ' g</p>' +
                '<p><b>碳水化合物: </b>' + row['carbohydrate'] + ' g</p>' +
                '</div>';
            if (row['contents'].length != 0) {
                html +=
                    '<div class="col-6">' +
                    '<b>內容物: </b>' +
                    '<ul>';
                for (var i = 0; i < row['contents'].length; i++)
                    html += '<li>' + row['contents'][i] + '</li>';
                html += '</ul>';
            }
            html += '</div>';
            return html;
        },
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
            title: '評分',
            formatter: function (data) {
                if (data != -1)
                    return data;
                else
                    return '-';
            },
        }, {
            field: 'updated_at',
            title: '修改時間'
        }, {
            field: 'photo_show',
            title: '圖片',
            width: 70,
            formatter: '<button id="btn_show_photo" class="btn btn-info">圖片</button>',
            events: operateEvents
        }, {
            field: 'sale',
            title: '販售',
            width: 70,
            formatter: '<button id="btn_sale" class="btn btn-primary">販售</button>',
        }]
    });

    $('#table_order').bootstrapTable({
        dataType: "json",
        classes: "table table-bordered table-striped table-sm",
        striped: true,
        pagination: true,
        sortable: true,
        uniqueId: 'order_id',
        sortName: 'order_id',
        pageNumber: 1,
        pageSize: 5,
        search: true,
        showPaginationSwitch: true,
        //detailView: true,
        //detailFormatter: function (index, row) {
        /*console.log(row);
        var html =
            '<div class="row" style="margin: 0px;padding: 0px 55px">' +
            '<div class="col-6">' +
            '<p><b>熱量: </b>' + row['calories'] + ' Kcal</p>' +
            '<p><b>蛋白質: </b>' + row['protein'] + ' g</p>' +
            '<p><b>脂肪: </b>' + row['fat'] + ' g</p>' +
            '<p><b>碳水化合物: </b>' + row['carbohydrate'] + ' g</p>' +
            '</div>';
        if (row['contents'].length != 0) {
            html +=
                '<div class="col-6">' +
                '<b>內容物: </b>' +
                '<ul>';
            for (var i = 0; i < row['contents'].length; i++)
                html += '<li>' + row['contents'][i] + '</li>';
            html += '</ul>';
        }
        html += '</div>';
        return html;*/
        //},
        columns: [{
            field: 'order_id',
            title: 'ID',
            //formatter: LinkFormatterCM
        }, {
            field: 'user.class',
            title: '班級'
        }, {
            field: 'user.account',
            title: '學號'
        }, {
            field: 'sale.dish.manufacturer_name',
            title: '供應商'
        }, {
            field: 'sale.dish.name',
            title: '名稱'
        }, {
            field: 'sale.dish.price',
            title: '售價'
        }, {
            field: 'sale.sale_at',
            title: '日期'
        }]
    });
    $('#table_sale').bootstrapTable({
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
        columns: [{
            field: 'id',
            title: '販賣ID',
            //formatter: LinkFormatterCM
        }, {
            field: 'sale_at',
            title: '販售日期'
        }, {
            field: 'dish.id',
            title: '餐點ID'
        }, {
            field: 'dish.name',
            title: '餐點名稱'
        }, {
            field: 'dish.manufacturer_name',
            title: '供應商'
        }, {
            field: 'dish.price',
            title: '售價'
        }, {
            field: 'status',
            title: '狀態'
        }, {
            field: 'created_at',
            title: '建立日期'
        }]
    });
    $('#table_balance_log').bootstrapTable({
        dataType: "json",
        classes: "table table-bordered table-striped table-sm",
        striped: true,
        pagination: true,
        uniqueId: 'id',
        sortName: 'create_at',
        pageNumber: 1,
        pageSize: 5,
        columns: [{
            field: 'id',
            title: '儲值ID',
            //formatter: LinkFormatterCM
        }, {
            field: 'account',
            title: '帳號'
        }, {
            field: 'user_name',
            title: '姓名'
        }, {
            field: 'event',
            title: '事件'
        }, {
            field: 'money',
            title: '金額'
        }, {
            field: 'trigger_name',
            title: '操作者姓名'
        }, {
            field: 'note',
            title: '備註'
        }, {
            field: 'created_at',
            title: '建立日期'
        }]
    });
}

function OnHashchangeListener() {
    if ($.cookie('access_token') != undefined)
        $('#btn_login').text(user['name'] + "/登出");
    else
        $('#btn_login').text("登入");

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

        getDishList().then(data => {
            $('#table_dish').bootstrapTable('load', data);
        });
    }
    if (hash == '#SaleManage' && login_check() && PermissionCheck(false, true)) {
        $('#Content_SaleManage').show();
        $("#title_bar").hide();

        getSaleList().then(data => {
            $('#table_sale').bootstrapTable('load', data);
        });
    }
    if (hash == '#OrderManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_OrderManage').show();
        $("#title_bar").hide();

        getOrderList().then(data => {
            $('#table_order').bootstrapTable('load', data);
        });
    }
    if (hash == '#BalanceManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_BalanceManage').show();
        $("#title_bar").hide();

        //$("#balance_block").hide();
    }
    if (hash == '#SystemSetting' && login_check() && PermissionCheck(true, true)) {
        $('#Content_SystemSetting').show();
        $("#title_bar").hide();

        ShowAlart('alert-warning', '尚未開放!!!', false, false);
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
        var getURl = new URL(location.href);
        var token = getURl.searchParams.get('token');
        if (getURl.searchParams.has('token')) {
            $('#row-fgtpw').show();
            $('#row-chgpw').hide();
            var tt = token.split('.');
            $('#ShowAcc').val(tt[0]);
        } else {
            $('#row-fgtpw').hide();
            $('#row-chgpw').show();
        }
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
    'click #btn_show_photo': function (e, value, row, index) {
        console.log(row['photo']);
        $('#img-show_dish_photo').prop('src', row['photo']);
        $('#modal-show_dish_photo').modal('show');
    }
};

function FormSubmitListener() {
    $('#form-HasToken').submit(function () {
        HideAlert();
        var getURl = new URL(location.href);
        if (!getURl.searchParams.has('token')) {
            location.replace("./index.html#ChangePW");
            return false;
        }
        var token = getURl.searchParams.get('token');
        var npw = $('#InputNewPw_f').val();
        var npwr = $('#InputNewPwRe_f').val();
        if (npw == "" || npwr == "") {
            $.alert({
                title: '錯誤',
                content: '新密碼或確認新密碼未輸入!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else if (npw != npwr) {
            $('#InputNewPw_f').val('');
            $('#InputNewPwRe_f').val('');
            $.alert({
                title: '錯誤',
                content: '確認新密碼不符合!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $('#InputNewPw_f').val('');
            $('#InputNewPwRe_f').val('');
            var data = {token: token, new_pswd: npw};
            var res = request('POST', '/pswd/token', data, false);
            if (res.code == 204) {
                ShowAlart('alert-success', '更改成功!!!', false, true);
                setTimeout(function () {
                    location.replace("./index.html#ChangePW");
                }, 2000);
            }
            if (res.code == 403) {
                if (res.data['error'] == 'Verify code expired') {
                    $.alert({
                        title: '錯誤',
                        content: 'Token過期!!請重新申請',
                        type: 'red',
                        typeAnimated: true,
                        onClose: function () {
                            setTimeout(function () {
                                location.replace("./index.html#ChangePW");
                            }, 1000);
                        }
                    });
                }
            }
            if (res.code == 404) {
                if (res.data['error'] == 'The User Not Found') {
                    $.alert({
                        title: '錯誤',
                        content: '使用者錯誤',
                        type: 'red',
                        typeAnimated: true,
                        onClose: function () {
                            setTimeout(function () {
                                location.replace("./index.html#ChangePW");
                            }, 1000);
                        }
                    });
                }
                if (res.data['error'] == 'The Token Not Found') {
                    $.alert({
                        title: '錯誤',
                        content: 'Token錯誤!!請重新申請',
                        type: 'red',
                        typeAnimated: true,
                        onClose: function () {
                            setTimeout(function () {
                                location.replace("./index.html#ChangePW");
                            }, 1000);
                        }
                    });
                }
            }
        }
        return false;
    });
    $('#form-Chgpw').submit(function () {
        HideAlert();
        var acc = $('#InputAcc').val();
        var oldpw = $('#InputOldPw').val();
        var npw = $('#InputNewPw').val();
        var npwr = $('#InputNewPwRe').val();
        if (npw == "" || npwr == "" || acc == "" || oldpw == "") {
            $.alert({
                title: '錯誤',
                content: '未輸入完整!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else if (npw != npwr) {
            $('#InputNewPw').val('');
            $('#InputNewPwRe').val('');
            $.alert({
                title: '錯誤',
                content: '確認新密碼不符合!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $('#InputNewPw').val('');
            $('#InputNewPwRe').val('');
            var data = {account: acc, old_pswd: oldpw, new_pswd: npw};
            var res = request('POST', '/pswd/account', data, false);
            if (res.code == 204) {
                ShowAlart('alert-success', '成功修改!!!', false, true);
                $('#InputAcc').val('');
                $('#InputOldPw').val('');
            }
            if (res.code == 403) {
                if (res.data['error'] == 'Old password error') {
                    $.alert({
                        title: '錯誤',
                        content: '舊密碼錯誤!!請重新輸入',
                        type: 'red',
                        typeAnimated: true
                    });
                    $('#InputOldPw').val('');
                }
            }
            if (res.code == 404) {
                if (res.data['error'] == 'The User Not Found') {
                    $.alert({
                        title: '錯誤',
                        content: '使用者尚未註冊',
                        type: 'red',
                        typeAnimated: true
                    });
                    $('#InputAcc').val('');
                    $('#InputOldPw').val('');
                }
            }
        }
        return false;
    });
    $('#form-GetToken').submit(function () {
        HideAlert();
        var email = $('#InputEmail').val();
        if (email == "") {
            $.alert({
                title: '錯誤',
                content: 'E-mail未輸入!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $('#InputEmail').val('');
            var data = {email: email, redirect: 'AdminFrontend'};
            var res = request('POST', '/pswd/forget', data, false);
            if (res.code == 204) {
                ShowAlart('alert-success', '已寄出!!!', false, true);
            }
            if (res.code == 400) {
                if (res.data['error'] == 'Email format error') {
                    $.alert({
                        title: '錯誤',
                        content: 'Email格式錯誤!!請重新輸入',
                        type: 'red',
                        typeAnimated: true
                    });
                }
            }
            if (res.code == 404) {
                if (res.data['error'] == 'The User Not Found') {
                    $.alert({
                        title: '錯誤',
                        content: '使用者尚未註冊',
                        type: 'red',
                        typeAnimated: true
                    });
                }
                if (res.data['error'] == 'The Redirect Not Found') {
                    $.alert({
                        title: '錯誤',
                        content: 'Redirect錯誤!!請聯繫管理員',
                        type: 'red',
                        typeAnimated: true
                    });
                }
            }
        }
        return false;
    });
}

function ButtonOnClickListener() {
    $('#btn_balance_query').click(function () {
        var account = $('#balance-account_input').val();
        if (account == '') {
            $("#balance_block").hide();
            $.alert({
                title: '錯誤',
                content: '帳號未輸入!!',
                type: 'red',
                typeAnimated: true
            });
            return false;
        }
        var res = request('GET', '/balance/log/' + account, null);
        if (res.code == 404) {
            $("#balance_block").hide();
            if (res.data['error'] == 'The User Not Found') {
                $.alert({
                    title: '錯誤',
                    content: '使用者錯誤!!',
                    type: 'red',
                    typeAnimated: true
                });
            }
            return false;
        }
        $("#balance_block").show();
        $('#balance_user_info_show_account').text(account);
        $('#balance_user_info_show_name').text(res.data['name']);
        $('#balance_user_info_show_balance').text(res.data['balance']);
        $('#table_balance_log').bootstrapTable('load', res.data['log']);
    });
    $('#btn_balance_money_50').click(function () {
        addValueToBalanceInput(50);
    });
    $('#btn_balance_money_100').click(function () {
        addValueToBalanceInput(100);
    });
    $('#btn_balance_money_500').click(function () {
        addValueToBalanceInput(500);
    });
    $('#btn_balance_money_1000').click(function () {
        addValueToBalanceInput(1000);
    });
    
}

async function getDishList() {
    var res = request('GET', '/dish');
    if (res.code == 404) {
        $.alert({
            title: '錯誤',
            content: '找不到!!',
            type: 'red',
            typeAnimated: true
        });
    }
    return res.data;
}

async function getOrderList() {
    var res = request('GET', '/order');
    if (res.code == 404) {
        $.alert({
            title: '錯誤',
            content: '找不到!!',
            type: 'red',
            typeAnimated: true
        });
    }
    return res.data;
}

async function getSaleList() {
    var res = request('GET', '/sale');
    if (res.code == 404) {
        $.alert({
            title: '錯誤',
            content: '找不到!!',
            type: 'red',
            typeAnimated: true
        });
    }
    return res.data;
}

function addValueToBalanceInput(num = 0) {
    var read = $('#balance-money_input').val();
    if (read == '')
        read = 0;
    var money = parseInt(read) + num;
    $('#balance-money_input').val(money);
}
