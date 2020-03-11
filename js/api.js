function request(httpMethod, route, dataObj, auth = true) {

    var responses = null;
    $.ajax({
        url: config['backend_URL'] + route,
        data: JSON.stringify(dataObj),
        type: httpMethod,
        contentType: 'application/json; charset=UTF-8',
        beforeSend: function (xhr) {
            if (auth && $.cookie('access_token') != undefined)
                xhr.setRequestHeader("Authorization", 'Bearer ' + $.cookie('access_token'));
        },
        async: false,
        complete: function (xhr) {
            responses = xhr;
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
    if (responses.status == 401 && !(httpMethod == 'POST' && route == '/oauth/token') && !(httpMethod == 'DELETE' && route.match('/oauth/token/')!=null)) {
        $.alert({
            title: '錯誤',
            content: '使用者驗證錯誤!!請重新登入',
            type: 'red',
            typeAnimated: true
        });
    }
    var result={'code': responses.status, 'data': responses.responseJSON};
    console.log(result);
    return result;
}