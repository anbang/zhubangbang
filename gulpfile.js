#!/usr/bin/env node
'use strict';
var path        = require('path');

var gulp        = require('gulp');
var replace     = require('gulp-replace');  //替换内容（用于修改版本号）
var jshint      = require('gulp-jshint');   //检测JS文件是否有语法错误；
var del         = require('del');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');

var browserify  = require('browserify');            //一个供浏览器环境使用的模块打包工具，像在node环境一样require('modules')
var exorcist    = require('exorcist');              //browserify-exorcist(生成sourcemap)
var source      = require('vinyl-source-stream');   //可以把普通的Node Stream转换为Vinyl File Object Stream;将Browserify的bundle()的输出转换为Gulp可用的一种虚拟文件格式流;
var streamify   = require('gulp-streamify');        //只支持 buffer 的插件直接处理 stream

// var babelify    = require('babelify');      //转换

// 配置文件
var version     = require('./lib/version.json');    //版本号来源
var DEST        = path.join(__dirname, 'dist/');

// build的文件
var dst             = 'czr';                //用于浏览器方面。包括外部依赖。
var lightDst        = 'czr-light';          //用于Repl控制台。不包括外部依赖。

var browserifyOptions = {
    debug: true,
    insert_global_vars: false, // jshint ignore:line
    detectGlobals: false,
    bundleExternal: true
};

//替换版本号
gulp.task('version', function(){
  gulp.src(['./package.json'])
    .pipe(replace(/\"version\"\: \"([\.0-9]*)\"/, '"version": "'+ version.version + '"'))
    .pipe(gulp.dest('./'));
});

//检查是否有语法错误
gulp.task('lint', [], function(){
    return gulp.src(['./index.js', './lib/*.js', './lib/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', ['lint'], function(cb) {
    del([ DEST ]).then(cb.bind(null, null));
});



//标准版
gulp.task('czr', ['clean'], function () {
    return browserify(browserifyOptions)
        .require('./lib/czr.js', {expose: 'czr'})
        // .transform(babelify)
        .bundle()
        .pipe(exorcist(path.join( DEST, dst + '.js.map')))
        .pipe(source(dst + '.js'))
        .pipe(gulp.dest( DEST ))
        .pipe(streamify(uglify()))
        .pipe(rename(dst + '.min.js'))
        .pipe(gulp.dest( DEST ));
});

// light版本
// gulp.task('light', ['clean'], function () {
//     return browserify(browserifyOptions)
//         .require('./lib/czr.js', {expose: 'czr'})
//         .ignore('bignumber.js')
//         .require('./lib/utils/browser-bignumber.js', {expose: 'bignumber.js'}) // fake bignumber.js
//         .transform(babelify)
//         .bundle()
//         .pipe(exorcist(path.join( DEST, lightDst + '.js.map')))
//         .pipe(source(lightDst + '.js'))
//         .pipe(gulp.dest( DEST ))
//         .pipe(streamify(uglify()))
//         .pipe(rename(lightDst + '.min.js'))
//         .pipe(gulp.dest( DEST ));
// });



gulp.task('watch', function() {
    gulp.watch(['./lib/*.js'], ['lint', 'build']);
});

gulp.task('default', [
    'version', 
    'lint', 
    'clean', 
    // 'light', 
    'czr'

]);