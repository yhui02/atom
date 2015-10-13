var crypto = require('crypto');

/**
 * aes加密
 * @param data
 * @param secretKey
 */
var aesEncrypt = function (data, secretKey) {
    var cipher = crypto.createCipher('aes-128-ecb', secretKey);
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
};

/**
 * aes解密
 * @param data
 * @param secretKey
 * @returns {*}
 */
var aesDecrypt = function (data, secretKey) {
    var cipher = crypto.createDecipher('aes-128-ecb', secretKey);
    return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
};


var key = '~!@#$%^&tbcHefei';
var data = {
    "time": 1443493862691,
    "sex": "SECRET",
    "corpCode": "cqrcpx",
    "userId": "fcap4cguiopkljhgfcvbnmh376fdycad",
    "mobile": "15000470009"
};
data = JSON.stringify(data);
console.log(data);

console.log('\n');

var re = aesEncrypt(data, key);
console.log(re);

console.log('\n');

var re2 = aesDecrypt(re, key);
console.log(re2);


