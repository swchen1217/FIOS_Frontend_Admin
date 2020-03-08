function request(httpMethod, route, dataObj) {
    var responses=null;
    $.ajax({
        url: config['backend_URL'] + route,
        data: JSON.stringify(dataObj),
        type: httpMethod,
        contentType: 'application/json; charset=UTF-8',
        async: false,
        complete: function (xhr) {
            console.log('ajax complete');
            responses = xhr;
        }
    });
    return {'code':responses.status,'data':responses.responseJSON};
}