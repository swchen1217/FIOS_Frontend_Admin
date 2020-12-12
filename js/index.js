var user;
var announcement_level;

function init() {
    $("#mNav .nav a").on("click", function () {
        $("#mNav .nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");
        $("#navbarToggler").collapse('hide');
    });
    $(".custom-file-input").change(function () {
        $(this).next(".custom-file-label").html($(this).val().split("\\").pop());
    });

    if ($.cookie('access_token') != undefined)
        user = jwt_decode($.cookie('access_token'))['user'];

    $('#balance-account_input').keypress(function (e) {
        var key = e.which;
        if (key == 13) {
            $('#btn_balance_query').click();
            return false;
        }
    });

    announcement_level = {
        success: {
            alert_class: "alert-success",
            level_title: "成功：",
            level_icon: "fa-check"
        },
        danger: {
            alert_class: "alert-danger",
            level_title: "錯誤：",
            level_icon: "fa-times"
        },
        warning: {
            alert_class: "alert-warning",
            level_title: "警告：",
            level_icon: "fa-exclamation-circle"
        },
        info: {
            alert_class: "alert-info",
            level_title: "資訊：",
            level_icon: "fa-info"
        }
    }

    initManufacturerSelect();

    $(".custom-file-input").change(function () {
        $(this).next(".custom-file-label").html($(this).val().split("\\").pop());
    });

    $("#input_sale_date").datepicker({
        dateFormat: "yy-mm-dd"
    });

    $("#order_info_date").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function (dateText) {
            orderDisplay(dateText);
        }
    });

    $("#sale_date").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function (dateText) {
            getSaleList(dateText).then(data => {
                $('#table_sale').bootstrapTable('load', data);
            });
        }
    });

    $("#input_total_start").datepicker({
        dateFormat: "yy-mm-dd"
    });

    $("#input_total_end").datepicker({
        dateFormat: "yy-mm-dd"
    });

    $("#input_balance_total_start").datepicker({
        dateFormat: "yy-mm-dd"
    });

    $("#input_balance_total_end").datepicker({
        dateFormat: "yy-mm-dd"
    });

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
                '<p><b>熱量: </b>' + escapeHtml(row['calories']) + ' Kcal</p>' +
                '<p><b>蛋白質: </b>' + escapeHtml(row['protein']) + ' g</p>' +
                '<p><b>脂肪: </b>' + escapeHtml(row['fat']) + ' g</p>' +
                '<p><b>碳水化合物: </b>' + escapeHtml(row['carbohydrate']) + ' g</p>' +
                '</div>';
            if (row['contents'].length != 0) {
                html +=
                    '<div class="col-6">' +
                    '<b>內容物: </b>' +
                    '<ul>';
                for (var i = 0; i < row['contents'].length; i++)
                    html += '<li>' + escapeHtml(row['contents'][i]) + '</li>';
                html += '</ul>';
            }
            html += '</div>';
            return html;
        },
        columns: [{
            field: 'id',
            title: 'ID'
        }, {
            field: 'name',
            title: '名稱',
            formatter: function (data) {
                return escapeHtml(data);
            },
        }, {
            field: 'manufacturer_name',
            title: '供應商',
            formatter: function (data) {
                return escapeHtml(data);
            },
        }, {
            field: 'price',
            title: '售價',
            formatter: function (data) {
                return escapeHtml(data);
            },
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
            events: operateEvents
        }, {
            field: 'delete',
            title: '刪除',
            width: 70,
            formatter: '<button id="btn_dish_delete" class="btn btn-danger">刪除</button>',
            events: operateEvents
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
        pageSize: 10,
        search: true,
        showPaginationSwitch: true,
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
        }, {
            field: 'delete',
            title: '刪除',
            width: 70,
            formatter: '<button id="btn_order_delete" class="btn btn-danger">刪除</button>',
            events: operateEvents
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
        pageSize: 10,
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
            title: '餐點名稱',
            formatter: function (data) {
                return escapeHtml(data);
            },
        }, {
            field: 'dish.manufacturer_name',
            title: '供應商',
            formatter: function (data) {
                return escapeHtml(data);
            },
        }, {
            field: 'dish.price',
            title: '售價',
            formatter: function (data) {
                return escapeHtml(data);
            },
        }, {
            field: 'status',
            title: '狀態',
            formatter: function (data) {
                return escapeHtml(data);
            },
        }, {
            field: 'created_at',
            title: '建立日期'
        }, {
            field: 'delete',
            title: '刪除',
            width: 70,
            formatter: '<button id="btn_sale_delete" class="btn btn-danger">刪除</button>',
            events: operateEvents
        }]
    });
    $('#table_balance_log').bootstrapTable({
        dataType: "json",
        classes: "table table-sm",
        pagination: true,
        uniqueId: 'id',
        sortName: 'create_at',
        pageNumber: 1,
        pageSize: 5,
        columns: [{
            field: 'id',
            title: '交易ID',
            //formatter: LinkFormatterCM
        }/*, {
            field: 'account',
            title: '帳號'
        }*/, {
            field: 'user_name',
            title: '姓名',
            formatter: function (data) {
                return escapeHtml(data);
            },
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
            title: '備註',
            formatter: function (data) {
                return escapeHtml(data);
            },
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

        getAnnouncement().then(data => {
            displayAnnouncement(data);
        });
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

        var date = dayjs().format('YYYY-MM-DD');
        $('#sale_date').val(date);
        getSaleList(date).then(data => {
            $('#table_sale').bootstrapTable('load', data);
        });
    }
    if (hash == '#OrderManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_OrderManage').show();
        $("#title_bar").hide();

        var date = dayjs().format('YYYY-MM-DD');
        orderDisplay(date);
    }
    if (hash == '#BalanceManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_BalanceManage').show();
        $("#title_bar").hide();

        $("#balance_block").hide();

        getBalanceToday().then(data => {
            $('#balance_money_show_today').text(data['Total revenue']);
        });
    }
    if (hash == '#SystemSetting' && login_check() && PermissionCheck(true, true)) {
        $('#Content_SystemSetting').show();
        $("#title_bar").hide();

        ShowAlart('alert-warning', '尚未開放!!!', false, false);
    }
    if (hash == '#UserManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_UserManage').show();
        $("#title_bar").hide();

        ShowAlart('alert-warning', '尚未開放!!請直接聯繫開發團隊!!!', false, false);

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
    // TODO
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

function roleCheck(role) {
    let pass = false;
    user['roles'].forEach(function (value) {
        if (value == role)
            pass = true;
    });
    return pass;
}

var dish_upload_photo_id;
var dish_sale_dish_id;

window.operateEvents = {
    // e      Event
    // value  undefined
    // row    rowdata
    // index  row
    'click #btn_show_photo': function (e, value, row, index) {
        $('#img-show_dish_photo').prop('src', row['photo']);
        $('#modal-show_dish_photo').modal('show');
        dish_upload_photo_id = row['id'];
    },
    'click #btn_dish_delete': function (e, value, row, index) {
        $.confirm({
            title: '確認刪除!!',
            content: '即將刪除餐點<br><b>若餐點 <i>販賣中</i> 將會造成嚴重影響</b>',
            type: 'red',
            autoClose: 'cancel|10000',
            buttons: {
                confirm: {
                    text: '刪除',
                    btnClass: 'btn-blue',
                    action: function () {
                        HideAlert();
                        var res = request('DELETE', '/dish/' + row['id'], null);
                        if (res.code == 204) {
                            ShowAlart('alert-success', '餐點已刪除', false, true);
                            getDishList().then(data => {
                                $('#table_dish').bootstrapTable('load', data);
                            });
                        }
                        if (res.code == 404) {
                            if (res.data['error'] == 'The Dish Not Found') {
                                $.alert({
                                    title: '錯誤',
                                    content: '餐點錯誤!!',
                                    type: 'red',
                                    typeAnimated: true
                                });
                            }
                        }
                    }
                },
                cancel: {
                    text: '取消'
                },
            }
        });
    },
    'click #btn_sale': function (e, value, row, index) {
        $('#modal-create_sale').modal('show');
        dish_sale_dish_id = row['id'];
    },
    'click #btn_sale_delete': function (e, value, row, index) {
        $.confirm({
            title: '確認刪除!!',
            content: '即將刪除販賣<br><b>若已有訂單，將會造成嚴重影響</b>',
            type: 'red',
            autoClose: 'cancel|10000',
            buttons: {
                confirm: {
                    text: '刪除',
                    btnClass: 'btn-blue',
                    action: function () {
                        HideAlert();
                        var res = request('DELETE', '/sale/' + row['id'], null);
                        if (res.code == 204) {
                            ShowAlart('alert-success', '販售已刪除', false, true);
                            getSaleList().then(data => {
                                $('#table_sale').bootstrapTable('load', data);
                            });
                        }
                        if (res.code == 404) {
                            if (res.data['error'] == 'The Sale Not Found') {
                                $.alert({
                                    title: '錯誤',
                                    content: '販售ID錯誤!!',
                                    type: 'red',
                                    typeAnimated: true
                                });
                            }
                        }
                    }
                },
                cancel: {
                    text: '取消'
                },
            }
        });
    },
    'click #btn_order_delete': function (e, value, row, index) {
        $.confirm({
            title: '確認刪除!!',
            content: '即將刪除訂單',
            type: 'red',
            autoClose: 'cancel|10000',
            buttons: {
                confirm: {
                    text: '刪除',
                    btnClass: 'btn-blue',
                    action: function () {
                        HideAlert();
                        var res = request('DELETE', '/order/' + row['order_id'], null);
                        if (res.code == 200) {
                            $.alert({
                                title: '成功',
                                content: '<b>刪除成功</b><br>' + res.data['before'] + '-' + res.data['total'] + '=' + res.data['after'],
                                type: 'green',
                                typeAnimated: true
                            });

                            orderDisplay($('#order_info_date').val());
                        }
                        if (res.code == 400) {
                            if (res.data['error'] == 'Sales time has passed') {
                                $.alert({
                                    title: '錯誤',
                                    content: '已超過刪除期限!!',
                                    type: 'red',
                                    typeAnimated: true
                                });
                            }
                        }
                    }
                },
                cancel: {
                    text: '取消'
                },
            }
        });
    },
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
    $('#form-newdish').submit(function () {
        var name = $('#newdish-InputName').val();
        var manufacturer_id = $('#newdish-InputManufacturer').val();
        var price = $('#newdish-InputPrice').val();
        var calories = $('#newdish-InputCalories').val();
        var protein = $('#newdish-InputProtein').val();
        var fat = $('#newdish-InputFat').val();
        var carbohydrate = $('#newdish-InputCarbohydrate').val();
        var contents = [];
        for (var i = 0; i < newdish_InputContentRow; i++) {
            var content = $('#newdish-InputContent_' + i).val();
            if (content != "")
                contents.push(content);
        }

        if (name != "" && manufacturer_id != null && price != "") {
            name = $('input[name*=ewdish-name-type]:checked').val() + " " + name;
            manufacturer_id = parseInt(manufacturer_id);
            price = parseInt(price);
            if (calories == "")
                calories = 0;
            if (protein == "")
                protein = 0;
            if (fat == "")
                fat = 0;
            if (carbohydrate == "")
                carbohydrate = 0;
            $.confirm({
                title: '新增餐點!!',
                content: '確認新增此餐點??',
                buttons: {
                    confirm: {
                        text: '確認',
                        btnClass: 'btn-blue',
                        action: function () {
                            HideAlert();
                            var data = {
                                name: name,
                                manufacturer_id: manufacturer_id,
                                price: price,
                                calories: calories,
                                protein: protein,
                                fat: fat,
                                carbohydrate: carbohydrate,
                                contents: contents
                            };
                            var res = request('POST', '/dish', data);
                            if (res.code == 201) {
                                $('#newdish-InputName').val('');
                                $('#newdish-InputManufacturer').val(null);
                                $('#newdish-InputPrice').val('');
                                $('#newdish-InputCalories').val('');
                                $('#newdish-InputProtein').val('');
                                $('#newdish-InputFat').val('');
                                $('#newdish-InputCarbohydrate').val('');
                                newdish_InputContentRow = 0;
                                var input = document.createElement("input");
                                input.type = "text";
                                input.className = "form-control";
                                input.id = "newdish-InputContent_0";
                                input.placeholder = "輸入內容物";
                                input.style.marginBottom = "5px";
                                var div = document.getElementById("newdish-Content");
                                div.innerHTML = input.outerHTML;
                                ShowAlart('alert-success', '餐點新增成功', false, true);
                                getDishList().then(data => {
                                    $('#table_dish').bootstrapTable('load', data);
                                });
                            }
                            if (res.code == 400) {
                                if (res.data['error'] == 'The request is incomplete') {
                                    $.alert({
                                        title: '錯誤',
                                        content: '輸入不完整!!',
                                        type: 'red',
                                        typeAnimated: true
                                    });
                                }
                                if (res.data['error'] == 'The manufacturer_id error') {
                                    $.alert({
                                        title: '錯誤',
                                        content: '廠商編號錯誤!!',
                                        type: 'red',
                                        typeAnimated: true
                                    });
                                }
                                if (res.data['error'] == '`price` must unsigned') {
                                    $.alert({
                                        title: '錯誤',
                                        content: '售價不可為負!!',
                                        type: 'red',
                                        typeAnimated: true
                                    });
                                }
                            }
                        }
                    },
                    cancel: {
                        text: '取消'
                    }
                }
            });
        } else {
            $.alert({
                title: '錯誤',
                content: '輸入不完整!!',
                type: 'red',
                typeAnimated: true
            });
        }
        return false;
    });
    $('#form-total').submit(function () {
        var startDate = $('#input_total_start').val();
        var endDate = $('#input_total_end').val();
        if (startDate != '' && endDate != '') {
            var res = request('GET', '/order/total/' + startDate + '/' + endDate, null);
            if (res.code == 200) {
                var card = document.getElementById("display_total");
                card.innerHTML = "";
                for (var i = 0; i < res.data.length; i++) {
                    var p = document.createElement("p");
                    var b = document.createElement("b");
                    var span = document.createElement("span");
                    b.innerHTML = res.data[i]['manufacturer_name'] + " : ";
                    span.innerHTML = res.data[i]['total'] + "元";
                    p.appendChild(b);
                    p.appendChild(span);
                    card.appendChild(p);
                }
            }
        } else {
            $.alert({
                title: '錯誤',
                content: '未輸入日期!!',
                type: 'red',
                typeAnimated: true
            });
        }
        return false;
    });
    $('#form-balance_total').submit(function () {
        var startDate = $('#input_balance_total_start').val();
        var endDate = $('#input_balance_total_end').val();
        if (startDate != '' && endDate != '') {
            var res = request('GET', '/balance/total/' + startDate + '/' + endDate, null);
            if (res.code == 200) {
                $('#display_balance_total').show();
                $('#display_balance_total_start').text(startDate);
                $('#display_balance_total_end').text(endDate);
                $('#display_balance_total_in').text(res.data['total_in']);
                $('#display_balance_total_out').text(res.data['total_out']);
                $('#display_balance_total_balance_date').text(res.data['total_balance_date']);
                $('#display_balance_total_balance_all').text(res.data['total_balance_all']);
                var div = document.getElementById("display_balance_total_manufacturer");
                div.innerHTML = "";
                for (var i = 0; i < res.data['out_manufacturer'].length; i++) {
                    var p = document.createElement("p");
                    var b = document.createElement("b");
                    var span = document.createElement("span");
                    b.innerHTML = res.data['out_manufacturer'][i]['manufacturer_name'] + " : ";
                    span.innerHTML = res.data['out_manufacturer'][i]['total'] + "元";
                    p.appendChild(b);
                    p.appendChild(span);
                    div.appendChild(p);
                }
            }
        } else {
            $.alert({
                title: '錯誤',
                content: '未輸入日期!!',
                type: 'red',
                typeAnimated: true
            });
        }
        return false;
    });
}

var balance_user_id;
var balance_account;

function ButtonOnClickListener() {
    $('#btn_balance_query').click(function () {
        var account = $('#balance-account_input').val();
        $('#balance-account_input').val("");
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
        console.log(res.data);
        balance_account = account;
        balance_user_id = res.data['user_id'];
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
    $('#btn_balance_reset').click(function () {
        $('#balance-money_input').val('');
    });
    $('#btn_balance_topUp').click(function () {
        var money = $('#balance-money_input').val();
        if (money == '') {
            $.alert({
                title: '錯誤',
                content: '金額不可為空!!',
                type: 'red',
                typeAnimated: true
            });
            return false;
        }
        money = parseInt(money);
        if (money < 0) {
            $.alert({
                title: '錯誤',
                content: '金額不可為負!!',
                type: 'red',
                typeAnimated: true
            });
            return false;
        }
        var data = {user_id: balance_user_id, money: money};
        var res = request('POST', '/balance/top-up', data);
        if (res.code == 200) {
            $('#balance-money_input').val('');
            var html =
                '<p><b>帳號: </b>' + balance_account + '</p>' +
                '<p><b>儲值前金額: </b>' + res.data['before'] + '</p>' +
                '<p><b>儲值金額: </b>' + res.data['total'] + '</p>' +
                '<p><b>儲值後金額: </b>' + res.data['after'] + '</p>';
            $.alert({
                title: '成功',
                content: html,
                type: 'green',
                typeAnimated: true
            });
            var res2 = request('GET', '/balance/log/' + balance_account, null);
            $('#balance_user_info_show_account').text(balance_account);
            $('#balance_user_info_show_name').text(res2.data['name']);
            $('#balance_user_info_show_balance').text(res2.data['balance']);
            $('#table_balance_log').bootstrapTable('load', res2.data['log']);
        }
        if (res.code == 400) {
            if (res.data['error'] == '`money` must unsigned') {
                $.alert({
                    title: '錯誤',
                    content: '金額不可為負!!',
                    type: 'red',
                    typeAnimated: true
                });
            }
            return false;
        }
        if (res.code == 404) {
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
    });
    $('#btn_balance_deduct').click(function () {
        var money = $('#balance-money_input').val();
        if (money == '') {
            $.alert({
                title: '錯誤',
                content: '金額不可為空!!',
                type: 'red',
                typeAnimated: true
            });
            return false;
        }
        money = parseInt(money);
        if (money < 0) {
            $.alert({
                title: '錯誤',
                content: '金額不可為負!!',
                type: 'red',
                typeAnimated: true
            });
            return false;
        }
        var html2 =
            '<p><b>帳號: </b>' + balance_account + '</p>' +
            '<p><b>扣款金額: </b>' + money + '</p>';
        $.confirm({
            title: '確認扣款!!',
            content: html2,
            type: 'red',
            buttons: {
                confirm: {
                    text: '確認',
                    btnClass: 'btn-blue',
                    action: function () {
                        var data = {user_id: balance_user_id, money: money};
                        var res = request('POST', '/balance/deduct', data);
                        if (res.code == 200) {
                            $('#balance-money_input').val('');
                            var html =
                                '<p><b>帳號: </b>' + balance_account + '</p>' +
                                '<p><b>扣款前金額: </b>' + res.data['before'] + '</p>' +
                                '<p><b>扣款金額: </b>' + res.data['total'] + '</p>' +
                                '<p><b>扣款後金額: </b>' + res.data['after'] + '</p>';
                            $.alert({
                                title: '成功',
                                content: html,
                                type: 'green',
                                typeAnimated: true
                            });
                            var res2 = request('GET', '/balance/log/' + balance_account, null);
                            $('#balance_user_info_show_account').text(balance_account);
                            $('#balance_user_info_show_name').text(res2.data['name']);
                            $('#balance_user_info_show_balance').text(res2.data['balance']);
                            $('#table_balance_log').bootstrapTable('load', res2.data['log']);
                        }
                        if (res.code == 400) {
                            if (res.data['error'] == '`money` must unsigned') {
                                $.alert({
                                    title: '錯誤',
                                    content: '金額不可為負!!',
                                    type: 'red',
                                    typeAnimated: true
                                });
                            }
                            if (res.data['error'] == 'Balance after deduct must unsigned') {
                                $.alert({
                                    title: '錯誤',
                                    content: '扣款後餘額為負!!',
                                    type: 'red',
                                    typeAnimated: true
                                });
                            }
                            return false;
                        }
                        if (res.code == 404) {
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
                    }
                },
                cancel: {
                    text: '取消'
                }
            }
        });
    });
    $('#order_before').click(function () {
        var date = dayjs($('#order_info_date').val()).subtract(1, 'day').format('YYYY-MM-DD');
        orderDisplay(date);
    });
    $('#order_after').click(function () {
        var date = dayjs($('#order_info_date').val()).add(1, 'day').format('YYYY-MM-DD');
        orderDisplay(date);
    });
    $('#sale_before').click(function () {
        var date = dayjs($('#sale_date').val()).subtract(1, 'day').format('YYYY-MM-DD');
        $('#sale_date').val(date);
        getSaleList(date).then(data => {
            $('#table_sale').bootstrapTable('load', data);
        });
    });
    $('#sale_after').click(function () {
        var date = dayjs($('#sale_date').val()).add(1, 'day').format('YYYY-MM-DD');
        $('#sale_date').val(date);
        getSaleList(date).then(data => {
            $('#table_sale').bootstrapTable('load', data);
        });
    });
    $('#btn_dish_photo_submit').click(function () {
        if ($('#dish_photo_URL').val() != "") {
            var data = {type: 'url', url: $('#dish_photo_URL').val()};
            var res = request('POST', '/dish/image/' + dish_upload_photo_id, data);
            if (res.code == 204) {
                $.alert({
                    title: '成功',
                    content: '上傳成功，重新整理以查看新照片!!',
                    type: 'green',
                    typeAnimated: true
                });
                $('#modal-edit_dish_photo').modal('hide');
            }
            if (res.code == 400) {
                $.alert({
                    title: '錯誤',
                    content: '上傳失敗!!',
                    type: 'red',
                    typeAnimated: true
                });
                return false;
            }
        } else {
            var file_data = $('#dish_photo_upload').prop('files')[0];
            var form_data = new FormData();
            form_data.append('type', 'image');
            form_data.append('image', file_data);
            var pb = $.dialog({
                title: '資料同步中',
                content: '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"style="width: 100%"></div></div>',
                closeIcon: false,
                columnClass: 'medium',
                lazyOpen: true,
            });
            var responses = null;
            $.ajax({
                url: config['backend_URL'] + '/dish/image/' + dish_upload_photo_id,
                data: form_data,
                type: 'POST',
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {
                    pb.open();
                    xhr.setRequestHeader("Authorization", 'Bearer ' + $.cookie('access_token'));
                },
                async: false,
                complete: function (xhr) {
                    responses = xhr;
                    pb.close();
                }
            });
            if (Math.floor(responses.status / 100) == 5) {
                $.alert({
                    title: '錯誤',
                    content: '系統發生錯誤!!請聯繫管理員',
                    type: 'red',
                    typeAnimated: true
                });
            }
            if (responses.status == 401) {
                $.alert({
                    title: '錯誤',
                    content: '使用者驗證錯誤!!請重新登入',
                    type: 'red',
                    typeAnimated: true
                });
            }
            if (responses.status == 403) {
                $.alert({
                    title: '錯誤',
                    content: '權限不足!!!',
                    type: 'red',
                    typeAnimated: true
                });
            }
            console.log(responses);
            if (responses.status == 204) {
                $.alert({
                    title: '成功',
                    content: '上傳成功，重新整理以查看新照片!!',
                    type: 'green',
                    typeAnimated: true
                });
                $('#modal-edit_dish_photo').modal('hide');
            }
            if (responses.status == 400) {
                $.alert({
                    title: '錯誤',
                    content: '上傳失敗!!',
                    type: 'red',
                    typeAnimated: true
                });
                return false;
            }
        }
    });
    $('#btn_create_sale').click(function () {
        var date = $('#input_sale_date').val();
        if (date != "") {
            var data = {sale_at: date, dish_id: dish_sale_dish_id, status: 1};
            var res = request('POST', '/sale', data);
            if (res.code == 201) {
                /*$.alert({
                    title: '成功',
                    content: '販售建立成功!!',
                    type: 'green',
                    typeAnimated: true
                });*/
                ShowAlart('alert-success', '販售建立成功,販售ID:' + res.data['id'], false, true);
                $('#modal-create_sale').modal('hide');
            }
            if (res.code == 400) {
                if (res.data['error'] == "Sales time has passed") {
                    $.alert({
                        title: '錯誤',
                        content: '販賣日期已過!!',
                        type: 'red',
                        typeAnimated: true
                    });
                }
            }
            if (res.code == 404) {
                if (res.data['error'] == "The Dish Not Found") {
                    $.alert({
                        title: '錯誤',
                        content: '餐點ID錯誤!!',
                        type: 'red',
                        typeAnimated: true
                    });
                }
            }
        } else {
            $.alert({
                title: '錯誤',
                content: '日期不可為空!!',
                type: 'red',
                typeAnimated: true
            });
        }
    });
    $('#btn_order_export').click(function () {
        var date = $('#order_info_date').val();
        var res = request('GET', '/export/order/' + date, null);
        if (res.code == 200) {
            window.open(res.data['url']);
        }
        if (res.code == 400) {
            $.alert({
                title: '錯誤',
                content: '日期格式不符!!',
                type: 'red',
                typeAnimated: true
            });
            return false;
        }
    });
    $('#btn_order_total').click(function () {
        $('#modal-order_total').modal('show');
    });
    $('#btn_balance_total').click(function () {
        $('#modal-balance_total').modal('show');
    });
    $('#btn_balance_total_print').click(function () {
        var bodyHtml = document.body.innerHTML;
        document.body.innerHTML = $("#area_balance_total_print").html();
        window.print();
        document.body.innerHTML = bodyHtml;
        window.location.reload();
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

async function getOrderList(date) {
    var res = request('GET', '/order/date/' + date);
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

async function getSaleList(date) {
    var res = request('GET', '/sale/date/' + date);
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

async function getBalanceToday() {
    var res = request('GET', '/balance/today');
    return res.data;
}

async function getOrderInfo(date) {
    var res = request('GET', '/order/info/' + date);
    var order_info_sale = document.getElementById("order_info_sale");
    var order_info_class = document.getElementById("order_info_class");
    var saleData = res.data['sale'];
    var sortData = res.data['sort'];
    var classData = res.data['class'];
    var sortM = Object.keys(sortData);
    var sortMS = [];
    for (var i = 0; i < sortM.length; i++)
        sortMS.push(Object.keys(sortData[sortM[i]]));

    order_info_sale.innerHTML = "";
    if (saleData.length == 0) {
        var alert = document.createElement("div");
        alert.className = "alert alert-warning";
        alert.style.marginTop = "16px";
        var row = document.createElement("div");
        row.className = "row";
        row.style.lineHeight = "32px";
        var col = document.createElement("div");
        col.className = "col";
        // TODO

        order_info_sale.appendChild(col);
    }
    for (var i = 0; i < saleData.length; i++) {
        var col = document.createElement("div");
        col.className = "col-12 col-md-6";
        col.style.padding = "0px 5px";
        var card = document.createElement("div");
        card.className = "card";
        card.style.padding = "5px";
        card.style.margin = "5px auto";
        var card_header = document.createElement("div");
        card_header.className = "card-header";
        card_header.style.padding = "10px 20px";
        var titleH5 = document.createElement("h5");
        titleH5.style.marginBottom = "2px";
        var card_body = document.createElement("div");
        card_body.className = "card-body";
        card_body.style.paddingTop = "15px";
        card_body.style.paddingBottom = "10px";
        var row = document.createElement("div");
        row.className = "row";
        var col_1 = document.createElement("div");
        col_1.className = "col";
        var col_2 = document.createElement("div");
        col_2.className = "col";
        var card_1 = document.createElement("div");
        card_1.className = "card";
        card_1.style.margin = "0px";
        var card_2 = document.createElement("div");
        card_2.className = "card";
        card_2.style.margin = "0px";
        var p_1 = document.createElement("p");
        p_1.style.margin = "0px";
        var p_2 = document.createElement("p");
        p_2.style.margin = "0px";
        var b_1 = document.createElement("b");
        var b_2 = document.createElement("b");
        var span_1 = document.createElement("span");
        var span_2 = document.createElement("span");

        titleH5.innerText = saleData[i]['manufacturer_name'] + " | " + saleData[i]['name'];
        b_1.innerText = "總數量: ";
        b_2.innerText = "總金額: $";
        span_1.innerText = saleData[i]['count'];
        span_2.innerText = saleData[i]['total'];

        card_header.appendChild(titleH5);
        p_1.appendChild(b_1);
        p_1.appendChild(span_1);
        p_2.appendChild(b_2);
        p_2.appendChild(span_2);
        card_1.appendChild(p_1);
        card_2.appendChild(p_2);
        col_1.appendChild(card_1);
        col_2.appendChild(card_2);
        row.appendChild(col_1);
        row.appendChild(col_2);
        card_body.appendChild(row);
        card.appendChild(card_header);
        card.appendChild(card_body);
        col.appendChild(card);

        order_info_sale.appendChild(col);
    }

    order_info_class.innerHTML = "";
    for (var g = 1; g <= 3; g++) {
        var col_g = document.createElement("div");
        col_g.className = "col-12 col-md-4";
        col_g.style.padding = "0px 5px";
        for (var c = 1; c <= 19; c++) {
            var card_c = document.createElement("div");
            card_c.className = "card";
            card_c.style.padding = "5px";
            card_c.style.margin = "5px auto";
            var card_c_header = document.createElement("div");
            card_c_header.className = "card-header";
            card_c_header.style.padding = "10px 20px";
            var card_c_header_h5 = document.createElement("h5");
            card_c_header_h5.style.marginBottom = "2px";
            var card_c_body = document.createElement("div");
            card_c_body.className = "card-body";
            card_c_body.style.padding = "5px";
            var cc = g + paddingLeft(c + "", 2);
            for (var m = 0; m < sortM.length; m++) {
                var row_m = document.createElement("div");
                row_m.className = "row";
                if (m != sortM.length - 1)
                    row_m.style.marginBottom = "5px";
                var col_m_name = document.createElement("div");
                col_m_name.className = "col-4";
                var col_m_name_p = document.createElement("p");
                col_m_name_p.style.margin = "0px";
                col_m_name_p.style.lineHeight = "36px";
                var col_m_name_b = document.createElement("b");
                col_m_name_b.innerHTML = sortM[m];
                col_m_name_p.appendChild(col_m_name_b);
                col_m_name.appendChild(col_m_name_p);
                row_m.appendChild(col_m_name);
                for (var sm = 0; sm < sortMS[m].length; sm++) {
                    var col_sm = document.createElement("div");
                    col_sm.className = "col-4";
                    if (sm % 2 == 1)
                        col_sm.style.paddingLeft = "5px";
                    else
                        col_sm.style.paddingRight = "5px";
                    var card_sm = document.createElement("div");
                    card_sm.className = "card";
                    card_sm.style.padding = "5px 10px";
                    card_sm.style.margin = "0px";
                    var card_sm_p = document.createElement("p");
                    card_sm_p.style.margin = "0px";
                    var card_sm_b = document.createElement("b");
                    var card_sm_span = document.createElement("span");
                    card_sm_b.innerHTML = sortMS[m][sm] + ": ";
                    card_sm_span.innerHTML =
                        classData[cc] != undefined
                            ? (
                                classData[cc][sortData[sortM[m]][sortMS[m][sm]]] != undefined
                                    ? classData[cc][sortData[sortM[m]][sortMS[m][sm]]]
                                    : "0")
                            : "0";
                    card_sm_p.appendChild(card_sm_b);
                    card_sm_p.appendChild(card_sm_span);
                    card_sm.appendChild(card_sm_p);
                    col_sm.appendChild(card_sm);
                    row_m.appendChild(col_sm);
                }
                card_c_body.appendChild(row_m);
            }
            card_c_header_h5.innerHTML = cc;
            card_c_header.appendChild(card_c_header_h5);
            card_c.appendChild(card_c_header);
            card_c.appendChild(card_c_body);
            col_g.appendChild(card_c);
        }
        order_info_class.appendChild(col_g);
    }
    return true;
}

async function getOrderInfoManufacturer(date) {
    var res = request('GET', '/order/date/' + date + '/manufacturer/' + user['number']);
    var order_info_sale = document.getElementById("order_info_sale");
    order_info_sale.innerHTML = "";
    for (let i = 0; i < res.data.length; i++) {
        let col = document.createElement("div");
        col.className = "col-12 col-md-6";
        col.style.padding = "0px 5px";
        let card = document.createElement("div");
        card.className = "card";
        card.style.padding = "5px";
        card.style.margin = "5px auto";
        let card_header = document.createElement("div");
        card_header.className = "card-header";
        card_header.style.padding = "10px 20px";
        let titleH5 = document.createElement("h5");
        titleH5.style.marginBottom = "2px";
        let card_body = document.createElement("div");
        card_body.className = "card-body";
        card_body.style.paddingTop = "15px";
        card_body.style.paddingBottom = "10px";
        let row = document.createElement("div");
        row.className = "row";
        let col_1 = document.createElement("div");
        col_1.className = "col";
        let col_2 = document.createElement("div");
        col_2.className = "col";
        let card_1 = document.createElement("div");
        card_1.className = "card";
        card_1.style.margin = "0px";
        let p_1 = document.createElement("p");
        p_1.style.margin = "0px";
        let b_1 = document.createElement("b");
        let span_1 = document.createElement("span");

        titleH5.innerText = res.data[i]['manufacturer_name'] + " | " + res.data[i]['dish_name'];
        b_1.innerText = "總數量: ";
        span_1.innerText = res.data[i]['order_qty'];

        card_header.appendChild(titleH5);
        p_1.appendChild(b_1);
        p_1.appendChild(span_1);
        card_1.appendChild(p_1);
        col_1.appendChild(card_1);
        row.appendChild(col_1);
        row.appendChild(col_2);
        card_body.appendChild(row);
        card.appendChild(card_header);
        card.appendChild(card_body);
        col.appendChild(card);

        order_info_sale.appendChild(col);
    }

    return true;
}

function paddingLeft(str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return paddingLeft("0" + str, lenght);
}

function dishPhotoSubmitCheck() {
    if ($("#dish_photo_upload").val().split("\\").pop() != "")
        $('#dish_photo_URL').prop('disabled', true);
    else
        $('#dish_photo_URL').prop('disabled', false);
    if ($('#dish_photo_URL').val() != "")
        $('#dish_photo_upload').prop('disabled', true);
    else
        $('#dish_photo_upload').prop('disabled', false);
    if ($("#dish_photo_upload").val().split("\\").pop() != "" || $('#dish_photo_URL').val() != "")
        $("#btn_dish_photo_submit").prop('disabled', false);
    else
        $("#btn_dish_photo_submit").prop('disabled', true);
}

var newdish_InputContentRow = 0;

function addNewDishContentRow() {
    newdish_InputContentRow++;
    var new_input = document.createElement("input");
    new_input.type = "text";
    new_input.className = "form-control";
    new_input.id = "newdish-InputContent_" + newdish_InputContentRow;
    new_input.placeholder = "輸入內容物";
    new_input.style.marginBottom = "5px";
    var div = document.getElementById("newdish-Content");
    div.appendChild(new_input);
}

function initManufacturerSelect() {
    var res = request('GET', '/manufacturer', null, false);
    for (var i = 0; i < res.data.length; i++) {
        var option = document.createElement("option");
        option.value = res.data[i]['id'];
        option.innerHTML = res.data[i]['name'];
        var select = document.getElementById("newdish-InputManufacturer");
        select.appendChild(option);
    }
}

function orderDisplay(date) {
    $('#order_info_date').val(date);
    if (roleCheck('manufacturer')) {
        getOrderInfoManufacturer(date).then(data => {
        });
    } else {
        getOrderInfo(date).then(data => {
        });
        getOrderList(date).then(data => {
            $('#table_order').bootstrapTable('load', data);
        });
    }
}

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

async function getAnnouncement() {
    var res = request('GET', '/notify/admin');
    return res.data;
}

function displayAnnouncement(data) {
    for (var i = data.length - 1; i >= 0; i--) {
        var dd = data[i];
        var card = document.createElement("div");
        card.className = "card";
        card.style.borderWidth = "2px";
        card.style.borderColor = "#a7a7a7";
        var alert = document.createElement("div");
        alert.className = "alert " + announcement_level[dd.level]['alert_class'];
        alert.style.margin = "0px";
        var alert_row = document.createElement("div");
        alert_row.className = "row";
        alert_row.style.lineHeight = "32px";
        var alert_row_col_0 = document.createElement("div");
        alert_row_col_0.className = "col-0";
        var alert_row_col_0_row = document.createElement("div");
        alert_row_col_0_row.className = "row";
        alert_row_col_0_row.style.margin = "0px";
        var alert_i = document.createElement("i");
        alert_i.className = "fa fa-2x " + announcement_level[dd.level]['level_icon'];
        alert_i.style.padding = "0px 10px";
        alert_i.style.margin = "0px 5px";
        var alert_col_0_span = document.createElement("span");
        alert_col_0_span.style.margin = "0px";
        alert_col_0_span.style.fontSize = "20px";
        var alert_b = document.createElement("b");
        var alert_row_col = document.createElement("div");
        alert_row_col.className = "col";
        alert_row_col.style.paddingLeft = "0px";
        var alert_col_span = document.createElement("span");
        alert_col_span.style.margin = "0px";
        alert_col_span.style.fontSize = "20px";
        var body = document.createElement("div");
        body.className = "card-body";
        body.style.padding = "10px";
        var body_p_1 = document.createElement("p");
        body_p_1.className = "card-text";
        var body_p_2 = document.createElement("p");
        body_p_2.style.textAlign = "right";
        body_p_2.style.margin = "0px";

        alert_b.innerHTML = escapeHtml(announcement_level[dd.level]['level_title']);
        alert_col_span.innerHTML = escapeHtml(dd.title);
        body_p_1.innerHTML = escapeHtml(dd.msg);
        body_p_2.innerHTML = escapeHtml("張貼者：" + dd.author) + "&nbsp;&nbsp;&nbsp;" + escapeHtml("張貼時間：" + dd.time);


        alert_row_col_0_row.appendChild(alert_i);
        alert_col_0_span.appendChild(alert_b);
        alert_row_col_0_row.appendChild(alert_col_0_span);
        alert_row_col_0.appendChild(alert_row_col_0_row);
        alert_row_col.appendChild(alert_col_span);
        alert_row.appendChild(alert_row_col_0);
        alert_row.appendChild(alert_row_col);
        alert.appendChild(alert_row);
        body.appendChild(body_p_1);
        body.appendChild(body_p_2);
        card.appendChild(alert);
        card.appendChild(body);

        var announcement = document.getElementById("announcement");
        announcement.appendChild(card);
    }
}