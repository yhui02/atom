/**
 * demo
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var notify = require("gulp-notify");
var useref = require('gulp-useref');
var htmlmin = require('gulp-htmlmin');
var uglifyInline = require('gulp-uglify-inline');
var header = require('gulp-header');
var ngmin = require('gulp-ngmin');
var livereload = require('gulp-livereload');
var minifyCss = require('gulp-minify-css');
var GulpSSH = require('gulp-ssh');
var zip = require('gulp-zip');
var bower = require('gulp-bower');
var mainBowerFiles = require('main-bower-files');


/**
 * admin
 *-------------------------------------------------------------*/
gulp.task('adminReload', function () {
    gulp.src([
        'public/assets/admin/**/*.*',
        'public/tpl/admin/**'
    ])
        .pipe(livereload());
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch([
        'public/assets/admin/**/*.*',
        'public/tpl/admin/**'
    ], ['adminReload']);
});


/**
 * front
 *-------------------------------------------------------------*/
gulp.task('css', function () {
    gulp.src([
        'public/ajax/vendor/others/angular-ui-grid/ui-grid.min.css',
        'public/ajax/vendor/hint.css/hint.min.css',
        'public/assets/front/css/twc-common-1.0.css',
        'public/assets/front/css/front.css',
        'public/assets/front/css/iconfont.css'
    ])
        .pipe(minifyCss())
        .pipe(concat('all-style.min.css'))
        .pipe(header('/**\n * <%= file.relative %>\n * build at: <%= new Date() %>\n */\n'))
        .pipe(gulp.dest('public/assets/front/css'))
        .pipe(notify('`css` files concat done!'));
});

gulp.task('tools', function () {
    // concat `others` folder all files
    gulp.src([
        'public/ajax/vendor/html2canvas-master/dist/html2canvas.js',
        'public/ajax/vendor/others/bootstrap-wysiwyg.js',
        'public/ajax/vendor/others/jquery.hotkeys.min.js',

        'public/ajax/vendor/iscroll/build/iscroll.js',
        'public/assets/front/jquery.qrcode.js',
        'public/assets/front/jquery.slider.js',
        'public/assets/front/jquery.twc.js'
    ])
        .pipe(uglify())
        .pipe(concat('all-tools.min.js'))
        .pipe(header('/**\n * <%= file.relative %>\n * build at: <%= new Date() %>\n */\n'))
        .pipe(gulp.dest('public/assets/front'))
        .pipe(notify('`others` js files concat done!'));
});

gulp.task('angularApp', function () {
    // angularjs files
    gulp.src([
        'public/ajax/vendor/others/angular-file-upload.min.js',
        'public/ajax/vendor/others/angular-file-upload-directives.min.js',
        'public/ajax/vendor/others/angular-locale_zh-cn.min.js',
        'public/ajax/vendor/others/angular-ui-grid/ui-grid.min.js',
        'public/ajax/vendor/others/ng-file-upload.js',
        'public/assets/front/angular-tpl.js',
        'public/assets/front/app.js',
        'public/assets/front/main.js',
        'public/assets/front/sceneCreateConsole.js',
        'public/assets/front/sceneEdit.js',
        'public/assets/front/scenePageEffect.js',
        'public/assets/front/userCenter.js',
        'public/assets/front/security.js',
        'public/assets/front/services.js',
        'public/assets/front/common.js',
        'public/assets/front/onload.js'
    ])
        .pipe(ngmin())
        .pipe(uglify())
        .pipe(concat('all-app.min.js'))
        .pipe(header('/**\n * <%= file.relative %>\n * build at: <%= new Date() %>\n */\n'))
        .pipe(gulp.dest('public/assets/front'))
        .pipe(notify('`angularApp` js files concat done!'));
});

gulp.task('ejs', function () {
    gulp.src('views/index.ejs')
        .pipe(useref())
        .pipe(uglifyInline())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('views/dist'))
        .pipe(notify("`views/dist/<%= file.relative %>` create done!"));
});

// 整体压缩处理
gulp.task('default', ['css', 'tools', 'angularApp', 'ejs']);


/**
 * zip
 *-------------------------------------------------------------*/
gulp.task('zip', function () {
    return gulp.src(['**', '!node_modules/**', '!test/**', '!logs/**', '!data/**'])
        .pipe(zip('twc-release-1.0.zip'))
        .pipe(gulp.dest('../'))
        .pipe(notify('release build done'));
});


/**
 * SSH
 *-------------------------------------------------------------*/
var config = {
    host: '192.168.1.214',
    port: 22,
    username: 'web',
    password: '******'
};

var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: config
});

gulp.task('sftp-getLog', function () {
    return gulpSSH.sftp('read', '/web/twc/twc-release/errors.log', {filePath: 'errors.log'})
        .pipe(gulp.dest('logs'))
});

// 同步代码到远程
gulp.task('sftp-dest', function () {
    return gulp
        .src(['**', '!node_modules/**', '!test/**', '!logs/**', '!data/**'])
        .pipe(gulpSSH.dest('/web/twc/twc-release/'))
});

// 更新配置信息
gulp.task('sftp-config', ['sftp-dest'], function () {
    return gulp.src('config-server.js')
        .pipe(gulpSSH.sftp('write', '/web/twc/twc-release/config.js'))
});

gulp.task('shell-init-getPid', function () {
    return gulpSSH
        .shell(['cd /web/twc/twc-release', 'npm install', 'ps -ef | grep twc'], {filePath: 'shell-pid.log'})
        .pipe(gulp.dest('logs'));
});

gulp.task('shell-start', function () {
    return gulpSSH
        .shell(['cd /web/twc/twc-release', 'nohup forever bin/www &', '\n'], {filePath: 'shell-start.log'})
        .pipe(gulp.dest('logs'));
});

gulp.task('release', ['sftp-dest', 'sftp-config']);


/**
 * bower
 *-------------------------------------------------------------*/
gulp.task('bower', function () {
    //return bower({ cmd: 'update'})
    return bower()
        .pipe(gulp.dest('public/ajax/lib'))
});

gulp.task('bowerFiles', function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('public/ajax/lib-dest'))
});

gulp.task('bowerFiles-min', function() {
    gulp.src('public/ajax/lib-dest/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/ajax/lib-dest'))
});