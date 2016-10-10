/**
 * author 
 */
//该文件放置项目目录下。
console.log("build start...");
var cfg = require('./config.json');
var argv = process.argv[2].split("/");
var project = argv[0];
var cfg = cfg[project];

// 配置要编译的项目和模块
var dest = "build/" + project + "/";
var resource = ".." + cfg.resource;   //静态资源根目录
var srcHtml = resource; //源模板文件目录
var destHtml = resource.replace("www_src", "php"); //编译后模板文件目录，可供测试和上线。
var imgSource = resource + "img/";
var defineSuffix = cfg.suffix;
var onlyHtml = false;

// 加载插件
var gulp = require('gulp'),
  htmlmin = require('gulp-htmlmin'),
  cleanCSS = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'), //没有 replace，有待改进。 
  useref = require('gulp-useref'), //useref  for 循环的坑，会报错。
  gulpif = require('gulp-if'),
  runSequence = require("run-sequence"),
  rev = require('gulp-rev'),
  revCollector = require('gulp-rev-collector'),
  fs = require('fs'),
  replace = require("gulp-replace"),
  del = require('del'),
  crypto = require('crypto'),

  changed = require('gulp-changed'),
  gutil = require('gulp-util'),
  through = require('through2'), // through2：Node Stream.Transform 流操作的简单封装。
  Promise = require('es6-promise').Promise,
  request = require('request'),
  minimist = require('minimist'),
  imagemin = require("gulp-imagemin"),
  revReplace = require('gulp-rev-replace'),
  chalk = require('chalk');

var argvArray = process.argv.slice(2);
var options = {default: { build: 'dev'}};
var options = minimist(argvArray, options);

var len = argvArray.length;
var popValue = argvArray[len-1];

if(len == 2){
   if(popValue != "html"){
      gutil.log(chalk.red('Params Error: ' + popValue + " is wrong!"));
      return;
   }
   onlyHtml = true;
}

var demain = "http://static.huajiao.com/huajiao/activity/";

// 加密输出
function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

function guid(exParams) {
    var arr = [];
    for (var o in exParams) {
      arr.push(o + '=' + exParams[o]);
    }
    return md5(arr.join('') + '03f0eac63e66d8c4a6f03d0217c0bc76');
}

var idSeed = 0;
function randomId() {
    return Date.now() + '_' + (++idSeed) + '_' + Math.floor(Math.random() * 1000);
}

function uploadCdn(file) {
    return new Promise(function(resolve, reject) {
        // 文件名 ： file.relative
        // 文件存放路径： file.path
        // 文件内容：file.contents.toString()
        var fileName = file.relative.replace(/\\/g, "/");
        var formData = {
          'deviceid': '1111-2222-3333-4444',
          'netspeed': '1000',
          'network': 'wifi',
          'platform': 'huajiao-fe-buildtools',
          'rand': randomId(),
          'time': Date.now(),
          'userid': '0',
          'version': '0.0.0'
        };

        formData.guid = guid(formData);
        formData.uploadid = 'huajiao_web';
        formData.path = 'activity';
        formData.name = fileName;
        formData.file = fs.createReadStream(file.path);

        request.post({url: 'http://upload.static.huajiao.com/file/upload',formData: formData}, function(err, httpResponse, body) {
            if (err) {
              reject(err);
            } else {
              try {
                var resp = JSON.parse(body);
                if (resp.errno === 0) {
                  gutil.log('upload cdn: ' + resp.data.url + ' ...' + chalk.green("ok"));
                  resolve(resp);
                } else {
                  reject(resp.errmsg);
                }
              } catch (e) {
                reject(e);
              }
            }
        });
    });
}

function uploadCdnTask() {
    
    return through.obj(function(file, enc, cb) {
        var filePath = file.relative;
        var st = Date.now();

        uploadCdn(file).then(function(data) {
            // gutil.log('upload cdn: ' + filePath + ' ...' + chalk.green((Date.now() - st) + 'ms'));
            cb(null, file);
        }).catch(function(err) {
            gutil.log(chalk.red('CdnError') + ', failed to upload ' + filePath);
        });
    });
}

// 编译前，先清除旧的版本文件。
gulp.task("build-clean", function(){
    del([dest + project, dest + "*.*", destHtml + "*.*"]);
});

// 图片压缩，包括jpg, png, gif  
gulp.task('imgmin', function(){
    return gulp.src(imgSource + "*.*")
    .pipe(imagemin()) //imageminJpegRecompress jpg 压缩效果不好
    .pipe(rev())
    .pipe(gulp.dest(dest + project + "/img/"));
});

// 对静态文件压缩、合并，输出到build目录下。
gulp.task("build", ["build-clean", "imgmin"], function(cb) {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        minifyJS: true,
        minifyCSS: true
    };

    return gulp.src(srcHtml + '*.html')
    .pipe(useref({
        searchPath: resource
    })) //调用顺序很关键。
    .pipe(gulpif(["*.phtml", "*.html", "*.tpl"], htmlmin(options)))
    .pipe(gulpif('*.css', cleanCSS()))
    .pipe(gulpif('*.js', uglify({
        mangle: true, //是否修改变量名
        compress: true, //是否完全压缩
        preserveComments: false //all保留所有注释, false删除所有注释，
    })))
    .pipe(gulpif("*.css", rev()))
    .pipe(gulpif("*.js", rev()))
    .pipe(gulp.dest(dest));
});

// 上传cdn的静态资源
var srcArray = [
    dest + '/**/js/*.*',
    dest + '/**/img/**/*.*',
    dest + '/**/css/*.*'
];

// 生成json文件，以供revreplace替换调用。
gulp.task("rev",['build', "replace"], function() {
    var timestamp = +new Date()/1000;
    return gulp.src(srcArray)
    .pipe(rev()) //对文件名加MD5后缀
    .pipe(rev.manifest("rev-manifest.json", {
        suffix: defineSuffix,
        host: demain
    }))
    .pipe(gulp.dest(dest + '/config'));
});

// 替换图片路径
gulp.task("replace", ["build"], function() {
    return gulp.src(dest + "/**")
    .pipe(gulpif(["*.html", "*.js"], replace('="img/', '="/'+ project +'/img/')))
    .pipe(gulpif("*.css", replace('url(../img/', 'url(/'+ project +'/img/')))
    .pipe(gulpif("*.js", replace('"img/', '"/'+ project +'/img/')))
    .pipe(gulp.dest(dest));
});

// 替换html、css、js里路径。
gulp.task("revreplace", ["rev"], function(){
    manifest = gulp.src(dest  + '/config/*.json');
    return gulp.src([dest + "/**"])
    .pipe(revReplace({manifest: manifest, replaceInExtensions : ['.html', '.tpl', '.phtml', '.css', ".js"]}))
    .pipe(gulpif('*.html', gulp.dest(destHtml)))
    .pipe(gulp.dest(dest));
});

gulp.task("html", function(){});

//资源上传cdn，合并、压缩.
gulp.task(project, ["build", "replace", "revreplace"], function(cb){
    if(onlyHtml){
        return;
    }
    return gulp.src(srcArray)
    .pipe(uploadCdnTask());
});