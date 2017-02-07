
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



## HTML+CSS开发规范参考

### 1. 规范概述

规范的制定是我们长期以来对工作的积累与沉淀的产物，帮助我们更快、更好、更高效的完成繁重、复杂、多样化的任务，我们制作规范的主要目的在于：

1. 降低每个组员介入项目的门槛成本；
2. 提高工作效率及协同开发的便捷性；
3. 高度统一的代码风格；
4. 提供一整套HTML、CSS解决方案，来帮助开发人员快速做出高质量的符合要求的页面；

### 2. 基本信息
<table>
   <tr>
      <th>文件夹及文件</th>
      <th>说明</th>
      <th>示例</th>
   </tr>
   <tr>
      <td>css</td>
      <td>存放所有.css文件</td>
      <td>reset.css、style.css</td>
   </tr>
   <tr>
      <td>js</td>
      <td>存放所有.js文件</td>
      <td>jquery.js</td>
   </tr>
   <tr>
      <td>bgimg</td>
      <td>存放所有网站样式图片</td>
      <td>bg.png</td>
   </tr>
   <tr>
      <td>pimg</td>
      <td>放所有数据图片，只是展示用，上线时会替换成真实数据</td>
      <td>p_300x150.jpg ① </td>
   </tr>
   <tr>
      <td>layout</td>
      <td>存放html或php框架页面文件</td>
      <td>index.html、list.html、index.php、list.php</td>
   </tr>
   <tr>
      <td>module</td>
      <td>存放模块化代码片段文件</td>
      <td>mininav.html、masheader.html、nav.html </td>
   </tr>
</table>

### 3. 通用约定
***
#### 3.1 分离
* 结构（HTML）、表现（CSS）、行为分离（JavaScript）

    <em>| 将结构与表现、行为分离，保证它们之间的最小耦合，这对前期开发和后期维护都至关重要</em>
    
#### 3.2 缩进
* 使用tab（4个空格宽度）来进行缩进

#### 3.3 编码
* 以 UTF-8 无 BOM 格式编码；
* 在HTML中文档中用 <meta charset="utf-8" /> 来指定编码；
* 在CSS中使用 @charset utf-8; 来指定编码；

#### 3.4 小写
* 所有的HTML标签必须小写
* 所有的HTML属性必须小写
* 所有的样式名及规则必须小写

#### 3.5 注释
* 尽可能的为你的代码写上注释。解释为什么要这样写，它是新鲜的方案还是解决了什么问题。

#### 3.6 行尾空格
* 删除行尾空格

#### 3.7 代码有效性
* 使用 W3C Markup Validation Service  来验证你的HTML代码有效性；
* 使用 W3C CSS Validation Service  来验证你的CSS代码有效性；

    <em>| 代码验证不是最终目的，真的目的在于让开发者在经过多次的这种验证过程后，能够深刻理解到怎样的语法或写法是非标准和不推荐的，即使在某些场景下被迫要使用非标准写法，也可以做到心中有数</em>
