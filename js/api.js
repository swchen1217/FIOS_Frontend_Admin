function request(httpMethod, route, dataObj, auth = true, headers = null) {
    if (auth)
        headers.Authorization = 'Bearer ' + $.cookie('access_token');
    var responses = null;
    $.ajax({
        url: config['backend_URL'] + route,
        data: JSON.stringify(dataObj),
        type: httpMethod,
        contentType: 'application/json; charset=UTF-8',
        headers: headers,
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
    if (responses.status == 401 && !(httpMethod == 'POST' && route == '/oauth/token')) {
        $.alert({
            title: '錯誤',
            content: '使用者驗證錯誤!!請重新登入',
            type: 'red',
            typeAnimated: true
        });
    }
    return {'code': responses.status, 'data': responses.responseJSON};
}