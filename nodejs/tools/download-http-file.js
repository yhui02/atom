var fs = require('fs'),
    path = require('path');
var request = require('request');

// 建立`./img`文件夹
var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        try {
            request(uri).pipe(fs.createWriteStream('img/' + filename)).on('close', callback);
        } catch (e) {
            console.error(e);
        }
    });
};


// test
download('https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png', 'baidu_logo.png', function (re) {
    console.log('done!');
});