# jQuery imgLazy

基于jQuery的图片懒加载插件（优化版）

## 动机

在之前有写过另一个用于图片懒加载的插件（[jquery-lazyload](https://github.com/springlong/jquery-lazyload)）。这款插件以 `$.fn` 的成员进行扩展调用，并且提供了对前景图和背景图的双重支持，另外还提供了指定目标容器的处理机制。

但是在实际使用的过程中，发现这两种功能只有在一些非常特殊的情况下才会使用。而为了满足可能永远也不会使用的特殊情况，不得不在每次浏览器的滚动条事件中增加不必要的判断，实属浪费。

而这里的这款插件，则是在原有插件的基础上，做减法处理，并对调用形式进行了相关优化。

相信这款插件，更够更好的为我们的网站进行服务。

## 效果欣赏

在介绍如何使用这款插件之前，大家可以先点击下面的链接查看相关的演示案例。

建议使用控制台中的网络面板来监测懒加载图片的请求。

1. [无效果](http://www.fedlife.cn/demo/jquery/jquery-imglazy/none.html)
2. [淡入效果](http://www.fedlife.cn/demo/jquery/jquery-imglazy/fadeIn.html)
3. [淡入效果（提前加载）](http://www.fedlife.cn/demo/jquery/jquery-imglazy/fadeIn-threshold.html)
4. [淡入效果（可视窗口）](http://www.fedlife.cn/demo/jquery/jquery-imglazy/fadeIn-viewport.html)
5. [淡入效果（可视窗口 + 提前加载）](http://www.fedlife.cn/demo/jquery/jquery-imglazy/fadeIn-viewport-threshold.html)
6. [淡入效果（可视窗口 + 延迟处理）](http://www.fedlife.cn/demo/jquery/jquery-imglazy/fadeIn-viewport-timeout.html)
7. [淡入效果（多次函数调用）](http://www.fedlife.cn/demo/jquery/jquery-imglazy/fadeIn-more-than-once.html)


## HTML代码

为img元素实现懒加载处理，首先需要为该图片设置一张占位图片，然后将真实的图片地址通过 `data-src` 的自定义属性进行设置，从而让这些图片默认不会被加载：

```html

<img src="images/default.gif" data-src="images/theReal.jpg" alt="描述文本">

```


## 脚本调用

当我们完成HTML代码中的准备工作后，我们需要调用 `$.imgLazy()` 函数来完成操作：

```js

$.imgLazy();  //使用默认参数进行处理

```

`$.imgLazy()` 函数的默认参数如下：

```js

{
	selector: "img[data-src]",  // 懒加载图片的选择器查询字符串。
	src: "data-src",  			// 懒加载图片的真实url的保存属性。
	effect: "none",   			// 用来指定加载图片时的效果，默认为"none"——即无效果，另外"fadeIn"——表示淡入效果。
	threshold: 0, 				// 设置一个阀值，用来指定可以提前加载多少范围之外的图片。默认为0——不提前加载。
	timeout: 0, 				// 懒加载行为响应的延迟时间，默认为0——表示不做延迟处理。
	viewport: false 			// 是否仅加载可视窗口之内的图片，默认为false——表示将加载可视窗口内以及位于之前的所有图片。
}

```

常见的函数调用组合如下：

```js

//指定懒加载图片的选择器查询字符串，以及图片真实url的保存属性
$.imgLazy({ selector: "img[data-src]"，src: "data-src" });

//图片加载后淡入显示
$.imgLazy({ effect: "fadeIn" });

//提前加载200px范围位于可视区域之外的图片
$.imgLazy({ threshold: 200 });

//仅只加载可视窗口内的图片，并延迟20ms触发懒加载行为
$.imgLazy({ viewport: true, timeout: 20 });

```

## 推荐特性

### `timeout` 参数

该参数用来设置懒加载行为响应的延迟时间（单位：毫秒），其目的用于避免浏览器的滚动行为而导致懒加载处理被频繁触发。

该参数的一个主要使用场景，需要与 `viewport` 参数搭配使用才能达到预期效果——就是当页面快速从顶部滑行到底部后，由于设置了延迟响应，因此位于页面中间的图片并不会被加载，因此进一步加快了位于底部图片的加载响应时间，同时也避免了中间部分的图片被加载的过程（可能用户并不会浏览到这些图片）。

关于该特性的具体效果，请查看后面的场景案例：[淡入效果（可视窗口 + 延迟处理）](http://www.fedlife.cn/demo/jquery/jquery-imglazy/fadeIn-viewport-timeout.html)

### 多次函数调用

这款图片懒加载的插件允许 `$.imgLazy()` 函数被多次调用。

第一次的调用，允许传递相关参数进行初始化操作——即绑定浏览器的滚动事件和处理行为。

而后续的每次调用，则表示对当前页面需要进行懒加载的图片进行重新初始化——即解除之前的行为绑定，并根据第一次调用传递的参数情况进行重新绑定。

关于该特性的具体效果，请查看后面的场景案例：[淡入效果（多次函数调用）](http://www.fedlife.cn/demo/jquery/jquery-imglazy/fadeIn-more-than-once.html)

### 事件绑定的自我解除

当页面中需要进行懒加载的图片都加载完毕后，程序将自动解除之前的事件绑定，避免浏览器进行不必要的响应行为。