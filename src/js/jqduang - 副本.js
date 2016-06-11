/*!
* @author : <%= author %> <ahuing@163.com>
* @date   : 2015-04-10
* @name   : <%= name %> v2.0
* @modify : <%= date %>
 */

!function ($, win, undefined) {
    'use strict';
    /**
     * @class Duang
     * @param {string} ele jq 选择器
     * @param {object} options 相关配置
     */
    var Duang = function (ele, options) {
        this.o       = options
        this.$ele    = $(ele)
        this.$obj    = this.$ele.find(options.obj)
        this.$objExt = this.$ele.find(options.objExt)
        // 如果正常的切换对象不存在,将扩展对象作为正常的对象,扩展对象清空
        if (!this.$obj.length) {
            this.$obj = this.$objExt
            delete this.$objExt;
        }
        // 对象长度
        this.len = this.$obj.length
        // 运动方向
        this.dire = options.effect.search(/top|weibo/) == 0 && 'top' || 'left'
        // 运动效果
        this.effect = options.effect.replace(this.dire, '')
    }

    /**
     * @name DEFAULTS
     * @param {string} obj=li jq选择器 要播放的对象
     * @param {?string} cell jq选择器 控制元素的父级 `是外层不是元素本身`
     * @param {string} trigger=mouseover 播放时控制元素上的触发事件 `click mouseover`
     * @param {string} effect=fade 播放效果 `fade fold left leftLoop leftMarqueue top topLoop topMarqueue weibo`
     * @param {number} speed=400 播放速度
     * @param {number} index=0 默认索引
     * @param {boolean} autoplay=1 自动播放
     * @param {number} interval=3000 播放间隔时间
     * @param {string} prevbtn jq选择器 播放上一个
     * @param {string} nextbtn jq选择器 播放上一个
     * @param {boolean} btnloop 点击上一个下一个按钮时是否循环播放
     * @param {number} delay=150 延迟时间,优化`click` or `mouseover`时延迟切换
     * @param {string} easing=swing 动画效果扩展 默认jQuery提供`linear` 和 `swing`  其它需要{@link http://gsgd.co.uk/sandbox/jquery/easing|easing}扩展支持
     * @param {boolean} fluid=0 启用流体,目前只支持`fade fold left leftLoop`当`o.visible=1` 时的设置
     * @param {string} lazyload=src 启用懒加载, 从图片的`data-src`读取图片的地址并替换给图片的`src`
     * @param {number} visible=1 可见数量
     * @param {number} steps=1 每次播放的数量
     * @param {boolean} overstop=1 鼠标悬停时是否停止播放
     * @param {boolean} showtit=0 是否显示当前播放的标题
     * @param {string} pagewrap jq选择器 要显示分页内容的父级
     * @param {boolean} wheel=0 是否启用鼠标滚动播放
     * @param {string} actclass=act 播放时当前控制元素上的`class`
     * @示例 从data启动
     * ```html
     * <div class="jqDuang" data-obj="li" data-cell=".sm" data-prevbtn=".prevbtn" data-nextbtn=".nextbtn" data-effect="left" data-pagewrap=".page">
     *     <div class="lg">
     *        <ul>
     *            <li> <a href=""> <img src="" alt=""/> </a> </li>
     *            <li> <a href=""> <img src="" alt=""/> </a> </li>
     *            <li> <a href=""> <img src="" alt=""/> </a> </li>
     *            <li> <a href=""> <img src="" alt=""/> </a> </li>
     *            <li> <a href=""> <img src="" alt=""/> </a> </li>
     *        </ul>
     *    </div>
     *    <div class="sm"></div>
     *    <div class="prevbtn"></div>
     *    <div class="nextbtn"></div>
     *    <div class="page"></div>
     * </div>
     * ```
     * @示例 从js启动
     * ```html
     * <div class="selector">
     *     <div class="lg">
     *        <ul>
     *            <li> <a href=""> <img src="" alt=""/> </a> </li>
     *            <li> <a href=""> <img src="" alt=""/> </a> </li>
     *            <li> <a href=""> <img src="" alt=""/> </a> </li>
     *            <li> <a href=""> <img src="" alt=""/> </a> </li>
     *            <li> <a href=""> <img src="" alt=""/> </a> </li>
     *        </ul>
     *    </div>
     *    <div class="sm"></div>
     *    <div class="prevbtn"></div>
     *    <div class="nextbtn"></div>
     *    <div class="page"></div>
     * </div>
     * ```
     * ```js
     * $('.selector').jqDuang({
     *   obj: 'li',
     *   cell: '',
     *   trigger: 'mouseover',
     *   effect: 'fade',
     *   speed: 400,
     *   index: 0 ,
     *   autoplay: 1,
     *   interval: 3000,
     *   prevbtn: '',
     *   nextbtn: '',
     *   delay: 150,
     *   easing: 'swing',
     *   fluid    : 0,
     *   lazyload : 0,
     *   visible: 1,
     *   steps: 1 ,
     *   overstop: 1,
     *   showtit: 0,
     *   pagewrap: '',
     *   btnloop: 1,
     *   wheel: 0,
     *   actclass: 'act'
     * })
     * ```
     * @可用参数及默认配置
     */
    Duang.DEFAULTS = {
        obj      : 'li',
        cell     : null,
        trigger  : 'mouseover',
        effect   : 'fade',
        speed    : 500,
        index    : 0,
        autoplay : 1,
        interval : 3000,
        prevbtn  : null,
        nextbtn  : null,
        delay    : 150,
        easing   : 'swing',
        fluid    : 0,
        lazyload : 'src',
        visible  : 1,
        steps    : 1,
        overstop : 1,
        showtit  : 0,
        pagewrap : null,
        btnloop  : 1,
        wheel    : 0,
        actclass : 'act'
    };

    Duang.prototype = {
        /**
         * @method lazyload 
         * @description 懒加载
         * @param {array} $items 要处理的img jq对象
         * @ignore
         */
        lazyload: function($items) {
            var lazyload = this.o.lazyload;
            $items.each(function(i, el) {
                $(this).find('img:not(".loaded")').attr('src', function() {
                    return $(this).addClass('loaded').data(lazyload);
                })
            });
        },
        /**
         * @method firstUper
         * @description 首页字母大写
         * @param  {string} str 要处理的字符串
         * @return {string}     处理后的字符串
         * @ignore
         */
        firstUper: function(str) {
            return str.replace(/(\w)/,function(s){
                return s.toUpperCase();
            })
        },
        /**
         * @method getSpace 
         * @description 获取dom的margin+padding
         * @param  {string} str 要处理的字符串
         * @return {string}     处理后的字符串
         * @ignore
         */
        getSpace: function($el, attr) {
            return $el['outer' + this.firstUper(attr)](true) - $el[attr]();
        },
        /**
         * @method initBtn 
         * @description 初始化按钮事件
         * @param  {string} type 按钮类型
         * @ignore
         */
        initBtn: function(type) {
            var _self  = this,
                o      = _self.o,
                $pnBtn = _self.$ele.find(o[type + 'btn']);

            $pnBtn.on(_self.effect == 'Marqueue' ? o.trigger : 'click.jd', function() {
                if ($(this).hasClass('disabled')) return;
                if (_self.effect == 'Marqueue') {
                    o.steps = type == 'prev' ? 1 : -1;
                    _self.next();
                } else _self[type]()
                // 如果是a链接不做跳转
                return false;
            }).attr({
                unselectable: 'on',
                onselectstart: 'return false;'
            });
        },
        init: function() {
            var _self      = this,
                $obj       = _self.$obj, 
                $objP      = $obj.parent(), 
                $objPP     = $objP.parent(), 
                o          = _self.o,
                ppCss      = {
                                position: 'relative',
                                overflow: 'hidden'
                            },
                dire       = _self.dire,
                attr       = dire == 'top' && 'height' || 'width', 
                outerAttr  = 'outer' + _self.firstUper(attr), 
                $cells;

            // 分页
            _self.pages = !_self.effect
                // 不循环滚动
                && Math.ceil((_self.len - o.visible) / o.steps) + 1
                // 循环滚动 marqueue loop
                || Math.ceil(_self.len / o.steps);

            
            // 只有一页,不切换
            if (_self.pages <= 1 || _self.len <= o.visible) return;
            // 速度为0时启用直接切换
            // if (!o.speed) {
            //     _self.effect = 'fade';
            // }

            $obj.css('float', dire == 'top' ? 'none' : 'left');
            // 每个单元的尺寸
                // console.log(outerAttr);
            if (!!o.fluid && o.visible == 1 && {fade: 1, fold: 1, leftLoop: 1, left: 1}[o.effect]) {
                // console.log('width');
                var attr = 'width', space = _self.getSpace($obj.eq(0), attr);
                _self.$ele.css(attr, 'auto');
                _self.size = _self.$ele[outerAttr](true);
                $obj.css(attr, _self.size - space);

                $(win).on('resize.jd', function() {
                    var oSize = _self.size;
                    _self.size = _self.$ele[outerAttr](true);
                    $objP.stop(true, true).css(dire, function(i, v) {
                        // 处理改变后的差值, 循环时+1
                        return parseInt(v) - (_self.size - oSize) * (_self.index + (_self.effect == 'Loop'));
                    });
                    $objPP.css(attr, _self.size);
                    _self.$obj.css(attr, _self.size - space);
                })
            } else {
                _self.size = $obj[outerAttr](true);
            }
            switch (_self.effect) {
                case 'fade':
                    _self.$obj.hide();
                    break;
                case 'fold':
                    $obj.css({
                        position: 'absolute',
                        display: 'none',
                        left: 0,
                        top: 0
                    });

                    ppCss['height'] = $obj.height();
                    $objPP.css(ppCss);
                    break;
                case 'weibo':
                    $objP.css('position', 'relative');
                    ppCss[attr] = _self.size * o.visible;
                    $objPP.css(ppCss);
                    break;
                case 'Marqueue':
                default:
                    var pCss = {
                            position: 'relative',
                            overflow: 'hidden'
                        },
                        $obj1 = $obj.eq(0),
                        // 计算多余的边距,让滚动外框两边对齐
                        marginMore = parseInt($obj1.css('margin-' + dire)) 
                                    - parseInt($obj1.css('margin-' + (dire == 'left' ? 'right' : 'bottom')));

                    pCss[attr] = 29999;

                    // loop marqueue
                    if (_self.effect) {
                        // 循环时处理
                        _self.$obj = $objP
                            .append($obj.slice(0, o.visible).clone())
                            .prepend($obj.slice(_self.len - o.visible).clone())
                            .children();
                        // marqueue
                        if (_self.effect == 'Marqueue') {
                            // 滚动的总大小
                            _self.scrollSize = _self.size * _self.len;
                            o.steps = -1;
                            pCss[_self.dire] = 0;
                        }
                    }
                    ppCss[attr] = _self.size * o.visible + marginMore;

                    $objP.css(pCss);
                    $objPP.css(ppCss);
            }

            // 加上作用域
            o.trigger = o.trigger.replace('.jd', '') + '.jd';
            // 分页
            if (o.cell && _self.effect != 'Marqueue') {
                var $cell = _self.$ele.find(o.cell),
                    t;
                $cells = $cell.children();

                if ($cells.length) {
                    $cells = $cells.slice(0, _self.pages);
                    $objP.data('cells', $cells.length);
                } else {
                    var __html = [];
                    for (var i = 0; i < _self.pages; i++) {
                        __html.push('<i>' + (i + 1) + '</i>');
                    }
                    $cells = $(__html.join('')).appendTo(_self.$ele.find(o.cell));
                }

                $cells.on(o.trigger, function() {
                        clearTimeout(t);
                        _self.loopNext = $cells.index(this);
                        t = setTimeout(function() {
                                _self.play(_self.loopNext);
                            }, o.delay)
                            //点击时阻止跳转
                        if (o.trigger == 'click.jd') return false;
                    })

                _self.$cells = $cells;
            }

            // 自动播放
            if (!!o.autoplay) {
                _self.start();
                (!!o.overstop) &&
                _self.$obj
                    .add($cells)
                    .add(o.prevbtn && _self.effect != 'Marqueue' && o.prevbtn + ',' + o.nextbtn || null)
                    .on('mouseover', $.proxy(_self.stop, _self))
                    .on('mouseout', $.proxy(_self.start, _self))
            }

            // 显示标题
            if (!!o.showtit && o.visible == 1) {
                var objD = $obj.eq(o.index).data();
                _self.$title = $('<a class="tit-jd" target="_blank" href="' + objD.url + '">' + objD.title + '</a>').insertAfter($objPP)
                objD = null;
            }

            // 上一个下一个
            if (o.prevbtn) {
                _self.initBtn('prev')
                _self.initBtn('next')
            }

            _self.play(_self.loopNext = o.index, 1)
        },
        /**
         * @method start
         * @description 自动播放插件
         * @示例 js
         * ```js
         *     $('[data-duang=1]').jqDuang('start');
         * ```
         */
        start: function() {
            clearInterval(this.t1);
            this.t1 = setInterval($.proxy(this.next, this), this.o.interval);
        },
        /**
         * @method stop 
         * @description 停止播放插件
         * @示例 js
         * ```js
         *     $('[data-duang=1]').jqDuang('stop');
         * ```
         */
        stop: function() {
            clearInterval(this.t1);
        },
        /**
         * @method getPage 
         * @param {number|string} i 页码
         * @description 获取第n页的对象合集
         * @return {array} jq对象
         * @示例 js
         * ```js
         *     $('[data-duang=1]').jqDuang('getPage');
         * ```
         */
        getPage: function(i) {
            var next = ((i + 1) % this.pages) * this.o.steps;
            var nextNext = ((next + 1) % this.pages) * this.o.steps || this.$obj.length;
            return this.$obj.slice(next, nextNext)
        },
        /**
         * @method next 
         * @description 播放下一个
         * @示例 js
         * ```js
         *     $('[data-duang=1]').jqDuang('next');
         * ```
         */
        next: function() {
            this.play(this.effect != 'Marqueue' && (this.loopNext = this.index + 1) % this.pages);
        },
        /**
         * @method prev 
         * @description 播放上一个
         * @示例 js
         * ```js
         *     $('[data-duang=1]').jqDuang('prev');
         * ```
         */
        prev: function() {            
            this.play(((this.loopNext = this.index - 1) + this.pages) % this.pages);
        },
        /**
         * @method play 
         * @description 播放第几个
         * @param {number} next 要播放的对象
         * @param {number} speed=0 切换速度
         * @示例 js
         * ```js
         *     $('[data-duang=1]').jqDuang(2);
         * ```
         * @参数说明
         */
        play: function(next, speed) {
            var _self    = this,
                o        = _self.o,
                $objP    = _self.$obj.parent(),
                pCss     = {},
                speed = speed || o.speed;

            if (_self.index == next && _self.effect != 'Marqueue') return;
            /**
             * @event before.jd
             * @description 播放前的事件
             */
            _self.$ele.trigger('before.jd');
            switch(_self.effect){
                case 'fade' :
                    !!o.lazyload && _self.lazyload(_self.$obj.eq(next));
                    _self.$obj.eq(_self.index).hide()
                    _self.$obj.eq(next).animate({
                        opacity: 'show'
                    }, speed, o.easing);
                    break;
                case 'fold' :
                    !!o.lazyload && _self.lazyload(_self.$obj.eq(next));
                    _self.$obj.stop(true, true).eq(_self.index)
                        .animate({
                            opacity: 'hide'
                        }, speed, o.easing);

                    _self.$obj.eq(next)
                        .animate({
                            opacity: 'show'
                        }, speed, o.easing);
                    break;
                case 'Marqueue' :
                    $objP.css(_self.dire, function(i, v) {
                        var offset = parseInt(v) + o.steps;
                        if (offset <= -_self.scrollSize) offset = 0;
                        else if (offset >= 0) offset = -_self.scrollSize;
                        return offset;
                    });
                    break;
                case 'weibo' :
                        pCss[_self.dire] = _self.size * 9 / 8;

                        $objP.stop(true, true)
                            .animate(pCss, speed, o.easing, function() {
                                var oLi = $objP.children()[_self.$obj.length - 1];
                                oLi.style.display = 'none';
                                $objP[0].insertBefore(oLi, $objP[0].children[0]);
                                $objP[0].style.top = 0;
                                $(oLi).fadeIn()
                            });
                    break;
                default :
                    var loopNext = _self.loopNext,
                        sSteps   = _self.len % o.steps || o.steps, // 剩余优先 当最后剩余的li不够一个steps时，计算小步长
                        start = 0,
                        end = o.visible,
                        oOffsets, // 原位置
                        offsets; // 目标位置;

                    if (_self.effect == 'Loop') {
                        if (loopNext == _self.pages) {
                            // 目标位置第一个位置
                            offsets = o.visible;
                            end = offsets + o.visible;
                            // last to first 定位到偏移第一个左边的一个steps的位置
                            $objP.css(_self.dire, -_self.size * (offsets - sSteps));
                            // return false;
                        } else if (loopNext == -1) {
                            // 目标位置最后一个 - 剩余的
                            start = offsets = o.visible + _self.len - sSteps;
                            end = undefined;
                            // first to last 定位到clone出来的第一个位置
                            $objP.css(_self.dire, -_self.size * (offsets + sSteps));
                            // return false;
                        } else {
                            // 正常切换 左边clone数 + 偏移数量
                            start = offsets = o.visible + next * o.steps;

                            if (offsets != 0) {
                                end += offsets;
                            }
                        }
                    } else {
                        if (loopNext == _self.pages - 1 || loopNext == -1) {
                            offsets = _self.len - o.visible;
                        } else {
                            offsets = next * o.steps;
                        }

                        start = offsets;
                        if (offsets != 0) {
                            end += offsets;
                        }
                    }

                    pCss[_self.dire] = -_self.size * offsets;
                    $objP.stop(true, _self.effect == 'Loop').animate(pCss, speed, o.easing, function() {
                        console.log(111);
                    });
                    // 懒加载
                    !!o.lazyload && _self.lazyload(_self.$obj.slice(start, end));
                    pCss = null;
            } // switch end
            // 标题
            if(!!o.showtit && o.visible == 1) {
                var objData = _self.$obj.eq(next + (_self.effect == 'Loop') * 1).data();
                _self.$title.html(objData.title)[0].href = objData.url;
            }
            // 分页
            if (o.pagewrap) {
                _self.$ele.find(o.pagewrap).html(next + 1 + '/' + _self.pages);
            }
            // 控制按钮
            if (o.cell) {
                _self.$cells.removeClass(o.actclass).eq(next).addClass(o.actclass)
            }
            // 扩展对象, next过大时没有扩展对象,不执行
            if (_self.$objExt.length > next) {
                _self.$objExt.hide().eq(next).show();
            }
            // 
            _self.index = next;
            // 按钮循环
            if (!o.btnloop && o.prevbtn) {
                _self.$ele.find(o.prevbtn + ',' + o.nextbtn).removeClass('disabled');
                next == 0 && _self.$ele.find(o.prevbtn).addClass('disabled');
                next == _self.pages - 1 && _self.$ele.find(o.nextbtn).addClass('disabled');
            }
            /**
             * @event before.jd
             * @description 播放后的事件
             */
            _self.$ele.trigger('after.jd');
        }

    }

    function Plugin(option, arg) {
        /*if (option == 'index') {
            return this.data('jqDuang').index;
        }

        if ({getPage: 1}[option]) {
            return this.data('jqDuang')[option](arg);
        }*/

        return option == 'index' ? this : this.each(function() {
            var $this = $(this),
                data = $this.data('jqDuang'),
                options;
            if (!data) {
                options = $.extend({}, Duang.DEFAULTS, $this.data(), typeof option == 'object' && option);

                $this.data('jqDuang', data = new Duang(this, options))
                data.init();
                options = null;
            }
            if (typeof option == 'string') {
                data[option](arg)
            } else if (typeof option == 'number') {
                data.play(data.loopNext = option)
            }
        })
    }

    var old = $.fn.jqDuang;

    $.fn.jqDuang             = Plugin
    $.fn.jqDuang.Constructor = Duang;

    $.fn.jqDuang.noConflict = function () {
        $.fn.jqDuang = old
        return this
    }

    $(win).on('load', function () {
        $('[data-duang=1], .jqDuang').each(function() {
            var $this = $(this);
            Plugin.call($this, $this.data())
        });
    })
}(jQuery, window);