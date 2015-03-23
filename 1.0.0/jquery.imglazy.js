/**
 * @file        基于jQuery的图片懒加载插件
 * @author      龙泉 <yangtuan2009@126.com>
 * @version     1.0.0
 */
(function(){

    /**
     * 图片懒加载的实现函数
     * @param {Object} options 配置对象
     * @param {string} options.selector 懒加载图片的选择器查询字符串。
     * @param {string} options.src 懒加载图片的真实url的保存属性。
     * @param {string} params.effect 用来指定加载图片时的效果，默认为"none"——即无效果，另外"fadeIn"——表示淡入效果。
     * @param {number} params.threshold 设置一个阀值，用来指定可以提前加载多少范围之外的图片。默认为0——不提前加载。
     * @param {number} params.timeout 懒加载行为响应的延迟时间，默认为0——表示不做延迟处理。
     * @param {boolean} params.viewport 是否仅加载可视窗口之内的图片，默认为false——表示将加载可视窗口内以及位于之前的所有图片。
     */
    function LazyLoad(options)
    {
        //参数匹配
        var $win = $(window),
            opt = $.extend({
                selector: "img[data-src]",
                src: "data-src",
                effect: "none",
                threshold: 0,
                timeout: 0,
                viewport: false
            }, options),
            src = opt.src,
            threshold = opt.threshold,
            eventName = "scroll resize",
            elements = [], timerID, goLoadImg;

        //初始化处理
        this.init = function() {

            elements.length = 0;

            $(opt.selector).each(function(){
                elements.push($(this));
            });

            $win.off(eventName, goLoadImg);
            $win.on(eventName, goLoadImg);

            goLoadImg();
        };

        //执行单次图片加载
        goLoadImg = opt.timeout === 0 ? loadImg : function(){
            clearTimeout(timerID);
            timerID = setTimeout(loadImg, opt.timeout);
        };

        //图片加载的处理函数
        function loadImg()
        {
            // console.info("loadImg start!");
            var i = 0,
                len = elements.length,
                scrollTop = $win.scrollTop(),
                viewHeight = $win.height(),
                $ele, offsetTop, cando;

            //循环图片列表，当图片位于显示窗口时则将其加载
            //每加载一张图片，则将该图片从elements数组中移除
            for(; i < len; ){

                $ele = elements[i];
                offsetTop = $ele.offset().top;
                cando = offsetTop <= scrollTop + viewHeight + threshold;
                cando = cando && (!opt.viewport || offsetTop + $ele.height() + threshold >= scrollTop);

                if(cando){

                    $ele.attr("src", $ele.attr(src)).removeAttr(src);
                    opt.effect === "fadeIn" && $ele.css("opacity", 0).animate({opacity: 1});

                    elements.splice(i, 1);
                    len--;

                }else{
                    i++;
                }
            }

            //解除事件绑定
            len === 0 && $win.off(eventName, goLoadImg);
        }
    }

    //对外提供接口调用
    $.imgLazy = function(options){

        var obj = new LazyLoad(options);
        $.imgLazy = obj.init;
        obj.init();
    };

})();