/**
 * 邮件发送
 * @type {exports|module.exports}
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
    host: 'mail-server.example.com',
    port: 25,
    auth: {
        user: 'admin@example.com',
        pass: '******'
    }
}));

transporter.sendMail({
    from: {
        name: '管理员',
        address: 'admin@example.com'
    },
    to: 'test@example.com',
    subject: '这是一个测试邮件发送',
    html: '大家好，<br/><span style="color:mediumvioletred">这是一封测试邮件。</span>'
}, function (err, re) {
    if (err) {
        throw new Error(err);
    }
    console.log(re);
});