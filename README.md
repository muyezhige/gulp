
1、svn up 更新项目根目录下的gulp文件夹。

2、根据 package.json 确保gulp插件安装正确。

3、在config.json中配置要打包的项目， 以"花椒之夜专题"为例

example:
	
	{
		"pepperTopic": {
			"resource" : "/www_src/share/banner/2016/pepperTopic/"
		}
	}

其中，pepperTopic 为项目名称， resource 为要打包的静态资源所在目录。

4、html模板中，css和js引用文件的配置规范

css:example

	<!-- build:css /pepperTopic/css/xxxx.css -->
    	<link rel="stylesheet" href="css/reset.css"/>
   		<link rel="stylesheet" href="css/index.css"/>
    <!-- endbuild -->

js:example

	<!-- build:js /pepperTopic/js/xxxx.js -->
	    <script src="js/core.js"></script>
	    <script src="js/lightbox.js"></script>
	    <script src="js/index.js"></script>
    <!-- endbuild -->

4、打包命令

cd进入到gulp目录下，

执行 gulp pepperTopic			
执行 gulp pepperTopic html  (只改动了html中非img、css、js的内容下使用)

===================================================================================

1、config.json 中可配置多个项目，用英文逗号分开

	{
		"pepperTopic": {
			"resource" : "/www_src/share/banner/2016/pepperTopic/"
		},
		"shouzhu": {
			"workplace"  : "activity",
			"resource" : "/www_src/share/promotion/2016/tuiguang/shouzhu/demo/"
		}
	}
2、 xxxx 表示可以任意名称