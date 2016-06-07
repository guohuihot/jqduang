/*
 * author : ahuing
 * date   : 2015-04-10
 * name   : jqDuang v1.1
 * modify : 2015-07-29 00:09:55
 */
/**
 * @module jqDuang
 */
! function($) {
    var Duang = function(self, opt) {
        this.o = $.extend({}, Duang.defaults, opt)
        this.$self = $(self)
        var aObj = this.o.obj.split('|');
        this.$obj = this.$self.find(aObj[0])
        this.$objExt = $(aObj[1])
            // 如果正常的切换对象不存在,将扩展对象作为正常的对象,扩展对象清空
        if (!this.$obj.length) {
            this.$obj = this.$objExt
            this.$objExt = []
        };
        /*aObj.shift();
        if (aObj.length) this.$objExt   = $.map(aObj, function (n) {
            return $(n);
        })*/
        this.direction = $.inArray(this.o.effect, ['left', 'leftLoop', 'leftMarqueue']) < 0 && 'top' || 'left'
        this.objAttr = this.direction == 'top' && 'height' || 'width'
        this.index = this.o.index
        this.effect = this.o.effect.replace(this.direction, '')
        this.L = this.$obj.length
            // 分页
        this.pages = !this.effect
            // 不循环滚动
            && Math.ceil((this.L - this.o.visible) / this.o.steps) + 1
            // 循环滚动
            || Math.ceil(this.L / this.o.steps);

        this.WH = {
            width: this.$obj.outerWidth(true),
            height: this.$obj.outerHeight(true)
        }
    }
    /**
     * @name 默认配置
     * @type {Object}
     * @param {string} obj jq选择器 要播放的对象
     * @param {string} cell jq选择器 控制元素的父级
     * @param {string} trigger 播放时控制元素上的触发事件 `click mouseover`
     * @param {string} effect 播放效果 `fade fold left leftLoop leftMarqueue top topLoop topMarqueue weibo`
     * @param {number} speed 播放速度
     * @param {number} index 默认索引
     * @param {boolean} autoplay 自动播放
     * @param {number} interval 播放间隔时间
     * @param {string} prevbtn jq选择器 播放上一个
     * @param {string} nextbtn jq选择器 播放上一个
     * @param {boolean} btnLoop 点击上一个下一个按钮时是否循环播放
     * @param {number} delay 延迟时间,优化click or mouseover时延迟切换
     * @param {string} easing 动画效果扩展 @see {@link http://gsgd.co.uk/sandbox/jquery/easing|easing} 
     * @param {number} visible 可见数量
     * @param {number} steps 每次播放的数量
     * @param {boolean} overstop 鼠标悬停时是否停止播放
     * @param {boolean} showtit 是否显示当前播放的标题
     * @param {string} pagewrap jq选择器 显示分页的父级
     * @param {boolean} wheel 是否启用鼠标滚动播放
     * @param {string} actclass 播放时当前控制元素上的`class`
     * @example
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
     * @example
     * ```js
     * $(selector).jqDuang({
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
     *   visible: 1,
     *   steps: 1 ,
     *   overstop: 1,
     *   showtit: 0,
     *   pagewrap: '',
     *   btnLoop: 1,
     *   wheel: 0,
     *   actclass: 'act'
     * })
     * ```
     */
    Duang.defaults = {
        obj: 'li',
        cell: '',
        trigger: 'mouseover',
        effect: 'fade',
        speed: 400,
        index: 0 ,
        autoplay: 1,
        interval: 3000,
        prevbtn: '',
        nextbtn: '',
        delay: 150,
        easing: 'swing',
        visible: 1,
        steps: 1 ,
        overstop: 1,
        showtit: 0,
        pagewrap: '',
        btnLoop: 1,
        wheel: 0,
        actclass: 'act'
    }

    Duang.prototype = {
        init: function() {
            var _this = this,
                o = _this.o,
                $obj = _this.$obj,
                $objP = $obj.parent(),
                $objPP = $objP.parent();

            if (_this.pages <= 1 || _this.L <= o.visible) return;
            // o.wrapsize && (_this.WH[_this.objAttr] = o.wrapsize);
            !o.speed && (_this.effect = 'fade');


            switch (_this.effect) {
                case 'fade':
                    $obj.css({
                        display: 'none'
                    }).eq(o.index).show();

                    // $objPP.css(_this.WH);
                    break;
                case 'fold':
                    $obj.css({
                        position: 'absolute',
                        display: 'none',
                        left: 0,
                        top: 0
                    }).eq(o.index).show();

                    var ppCss = _this.WH;
                    ppCss['position'] = 'relative';
                    $objPP.css(ppCss);
                    break;
                case 'weibo':
                    $objP.css('position', 'relative');
                    var ppCss = {
                        position: 'relative',
                        overflow: 'hidden'
                    };
                    ppCss[_this.objAttr] = o.wrapsize || _this.WH[this.objAttr] * o.visible
                    $objPP.css(ppCss);
                    break;
                case 'Marqueue':
                default:
                    $obj.css({
                        float: 'left'
                    });

                    var pCss = {
                        position: 'relative',
                        overflow: 'hidden'
                    };
                    pCss[_this.direction] = -_this.WH[_this.objAttr] * o.index;
                    pCss[_this.objAttr] = 9999;

                    if (_this.effect) {
                        _this.$obj = $objP
                            .append($obj.slice(0, o.visible).clone())
                            .prepend($obj.slice($obj.length - o.visible).clone())
                            .children();

                        pCss[_this.direction] = -(o.visible + o.index * o.steps) * _this.WH[_this.objAttr];
                        // marqueue
                        if (_this.effect == 'Marqueue') {
                            _this.s = -1;
                            _this.scrollSize = _this.WH[_this.objAttr] * _this.L;
                        }
                    };
                    $objP.css(pCss);

                    var ppCss = {
                        overflow: 'hidden'
                    };
                    // ppCss[_this.objAttr] = o.wrapsize || _this.WH[_this.objAttr] * o.visible;
                    // 处理最后的边距,让整个滚动图片两边对齐
                    var $obj1 = $obj.eq(0);
                    var marginMore = parseInt($obj1.css('margin-' + this.direction)) - parseInt($obj1.css('margin-' + (this.direction == 'left' ? 'right' : 'bottom')));
                    // 设置外层的尺寸
                    ppCss[_this.objAttr] = o.wrapsize || _this.WH[_this.objAttr] * o.visible + marginMore;

                    $objPP.css(ppCss);
            }

            // 分页
            var t;
            if (o.cell && _this.effect != 'Marqueue') {
                var aCell = o.cell.split('|');

                _this.$cells = aCell.length > 1 ? _this.$self.find(aCell[1]) : _this.$self.find(aCell[0]).children();
                if (_this.$cells.length) _this.$cells = _this.$cells.slice(0, _this.pages);
                else {
                    var __html = '';
                    for (var i = 0; i < _this.pages; i++) __html += '<i>' + (i + 1) + '</i>';
                    _this.$cells = $(__html).appendTo(aCell[0]);
                }

                _this.$cells[o.trigger](function() {
                        clearTimeout(t);
                        _this.loopNext = _this.$cells.index(this);
                        t = setTimeout($.proxy(function() {
                                _this.play(_this.loopNext);
                            }, _this), o.delay)
                            //点击时阻止跳转
                        if (o.trigger == 'click') return false;
                    })
                    .eq(_this.index).addClass(o.actclass);
            };

            // 自动播放
            if (o.autoplay * 1) {
                _this.start();
                if (o.overstop * 1) {
                    $objP.add(_this.$cells)
                        .on('mouseover', function(e) {
                            _this.stop();
                        })
                        .on('mouseout', function(e) {
                            _this.start();
                        });

                    o.prevbtn && _this.effect != 'Marqueue' && _this.$self.find(o.prevbtn + ',' + o.nextbtn).on('mouseover mouseout', function(e) {
                        $objP.trigger(e.type)
                    });
                }
            };

            // 显示标题
            o.showtit * 1 && o.visible == 1 && $objPP.after('<a class="txt" target="_blank" href="' + $obj.eq(o.index).data('url') + '">' + $obj.eq(o.index).data('title') + '</a>')

            // 页码
            o.pagewrap && _this.$self.find(o.pagewrap).html(_this.index * 1 + 1 + '/' + _this.pages);

            // 上一个下一个
            o.prevbtn && goBtn('prev') && goBtn('next')

            function goBtn(p) {
                var $pnBtn = _this.$self.find(o[p + 'btn']);
                !(o.btnLoop * 1) && p == 'prev' && $pnBtn.addClass('disabled');
                $pnBtn[_this.effect == 'Marqueue' ? o.trigger : 'click'](function() {
                    if ($(this).hasClass('disabled')) return;
                    _this.s = p == 'next' ? -1 : 1;
                    if (_this.effect == 'Marqueue') _this.next();
                    else _this[p]()
                }).attr({
                    unselectable: 'on',
                    onselectstart: 'return false;'
                });
                return true;
            }
            // 鼠标滚动切换
            o.wheel * 1 && $.fn.mousewheel && $objPP.mousewheel(function(e, delta) {
                clearTimeout(t);
                t = setTimeout($.proxy(function() {
                    _this[delta > 0 ? 'prev' : 'next']()
                }, _this), 100)
            });
            // 处理扩展的切换对象
            /*_this.$objExt && $.each(_this.$objExt, function (j, e) {
                e.css('display','none').eq(o.index).show()
            });*/
            _this.$objExt.length > o.index && _this.$objExt.css('display', 'none').eq(o.index).show();

        },
        /**
         * @method 开始播放
         * @example
         * ```js
         * $(selector).jqDuang('start');
         * ```
         */
        start: function() {
            this.t1 = setInterval($.proxy(this.next, this), this.o.interval);
        },
        /**
         * @method 停止播放
         * @example
         * ```js
         * $(selector).jqDuang('stop');
         * ```
         */
        stop: function() {
            clearInterval(this.t1);
        },
        /**
         * @method 播放下一个
         * @example
         * ```js
         * $(selector).jqDuang('next');
         * ```
         */
        next: function() {
            this.play(this.effect != 'Marqueue' && (this.loopNext = this.index + 1) % this.pages);
        },
        /**
         * @method 播放上一个
         * @example
         * ```js
         * $(selector).jqDuang('prev');
         * ```
         */
        prev: function() {
            this.loopNext = this.index - 1;
            this.play((this.loopNext + this.pages) % this.pages);
        },
        /**
         * @method 播放第n个
         * @example
         * ```js
         * $(selector).jqDuang(2);
         * ```
         */
        play: function(next) {
            var _this = this,
                o = _this.o,
                $obj = _this.$obj,
                $objP = $obj.parent(),
                loopNext = _this.loopNext;

            if (_this.index == next && _this.effect != 'Marqueue') return;

            _this.$self.trigger('beforeFun');
            switch (_this.effect) {
                case 'fade':
                    $obj.eq(_this.index).hide()
                    $obj.eq(next).animate({
                        opacity: 'show'
                    }, o.speed, o.easing);
                    break;
                case 'fold':
                    $obj.stop(true, true).eq(_this.index)
                        .animate({
                            opacity: 'hide'
                        }, o.speed, o.easing);

                    $obj.eq(next)
                        .animate({
                            opacity: 'show'
                        }, o.speed, o.easing);
                    break;
                case 'Marqueue':
                    $objP.css(_this.direction, function(i, v) {
                        var offset = parseInt(v) + _this.s;
                        if (offset <= -_this.scrollSize) offset = 0;
                        else if (offset >= 0) offset = -_this.scrollSize;
                        return offset;
                    });
                    break;
                case 'weibo':
                    var pCss = {};
                    pCss[_this.direction] = _this.WH[_this.objAttr] * 9 / 8;

                    $objP.stop(true, true)
                        .animate(pCss, o.speed, o.easing, function() {
                            var oLi = $objP.children()[$obj.length - 1];
                            oLi.style.display = 'none';
                            $objP[0].insertBefore(oLi, $objP[0].children[0]);
                            $objP[0].style.top = 0;
                            $(oLi).fadeIn()
                        });
                    break;
                default:
                    var mm = 0;
                    if (this.effect == 'Loop') {
                        if ($objP.is(':animated')) return false;;
                        var offset, _mod = _this.L % o.steps;
                        // 第一页
                        if (_mod && loopNext == _this.pages) {
                            mm = _mod - o.steps;
                        }
                        // 最后一页
                        else if (_mod && loopNext == -1) {
                            mm = o.steps - _mod;
                        }
                        offset = loopNext * o.steps + o.visible + mm;
                        var comFun = function() {
                            $objP.css(_this.direction, -_this.WH[_this.objAttr] * (next * o.steps + o.visible));
                        }
                    } else if (loopNext == _this.pages - 1 || loopNext == -1) {
                        mm = _this.L - next * o.steps - o.visible
                    };

                    // offset = offset || next * o.steps + mm;
                    // offset = this.effect == 'Loop' && offset || next * o.steps + mm;

                    var pCss = {};
                    // pCss[_this.direction] = -_this.WH[_this.objAttr] * offset;
                    pCss[_this.direction] = -_this.WH[_this.objAttr] * (this.effect == 'Loop' ? offset : next * o.steps + mm);

                    $objP.stop(true)
                        .animate(pCss, o.speed, o.easing, comFun);
            } // switch end
            // 标题
            if (o.showtit * 1 && o.visible == 1) {
                var nextEleData = $obj.eq(next + (this.effect == 'Loop' ? 1 : 0)).data();
                _this.$self.find('.txt').html(nextEleData.title)[0].href = nextEleData.url;
            }
            // 分页
            o.pagewrap && _this.$self.find(o.pagewrap).html(next + 1 + '/' + _this.pages);
            // 控制按钮
            o.cell && _this.$cells.removeClass(o.actclass).eq(next).addClass(o.actclass)
                // 扩展对象, next过大时没有扩展对象,不执行
            _this.$objExt.length > next && _this.$objExt.css('display', 'none').eq(next).show();
            // 
            _this.index = next;
            // 按钮循环
            if (!(o.btnLoop * 1) && o.prevbtn) {
                _this.$self.find(o.prevbtn + ',' + o.nextbtn).removeClass('disabled');
                next == 0 && _this.$self.find(o.prevbtn).addClass('disabled');
                next == _this.pages - 1 && _this.$self.find(o.nextbtn).addClass('disabled');
            }
            _this.$self.trigger('afterFun', [next]);
        }

    }

    function Plugin(option) {
        return option == 'index' ? this.data('jqDuang').index : this.each(function() {
            var $this = $(this)
            var data = $this.data('jqDuang')
            var options = typeof option == 'object' && option

            if (!data) {
                $this.data('jqDuang', (data = new Duang(this, options)));
                data.init();
            }

            if (typeof option == 'string') data[option]()
            else if (typeof option == 'number') data.play(data.loopNext = option)
        })
    }

    var old = $.fn.jqDuang;

    $.fn.jqDuang = Plugin
    $.fn.jqDuang.Constructor = Duang;

    $.fn.jqDuang.noConflict = function() {
        $.fn.jqDuang = old
        return this
    }

    $(window).on('load', function() {
        $('.jqDuang').each(function() {
            var $this = $(this);
            Plugin.call($this, $this.data())
        });
    })
}(jQuery);