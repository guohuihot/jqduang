/*!
* @author : <%= author %>
* @date   : 2015-04-10
* @name   : <%= name %> v1.16
* @modify : <%= date %>
 */

!function ($, win) {
    'use strict';
    var Duang = function (element, options) {
        this.o         = options
        this.$element     = $(element)
        this.$obj      = this.$element.find(options.obj)
        this.$objExt   = this.$element.find(options.objExt)
        // 如果正常的切换对象不存在,将扩展对象作为正常的对象,扩展对象清空
        if (!this.$obj.length) {
            this.$obj = this.$objExt
            delete this.$objExt;
        }

        this.len = this.$obj.length
        // 运动方向
        options.dire = options.effect.indexOf('left') == 0 && 'left' || 'top';
        this.effect = options.effect.replace(options.dire, '')
            // 分页
        this.pages = !this.effect
            // 不循环滚动
            && Math.ceil((this.len - options.visible) / options.steps) + 1
            // 循环滚动 marqueue loop
            || Math.ceil(this.len / options.steps);
        
    }

    Duang.DEFAULTS = {
        obj: 'li',
        cell: null,
        //click mouseover
        trigger: 'mouseover',
        //效果 fold left leftLoop leftMarqueue top topLoop topMarqueue weibo
        effect: 'fade',
        //播放速度
        speed: 500,
        //默认索引
        index: 0,
        //自动播放
        autoplay: 1,
        //播放间隔时间
        interval: 3000,
        //上一个
        prevbtn: null,
        //下一个
        nextbtn: null,
        //延迟时间,优化click or mouseover时延迟切换
        delay: 150,
        easing: 'swing',
        //外层大小
        // wrapsize : 0 ,

        //可见数量
        visible: 1,
        //每次切换的数量
        steps: 1,
        //鼠标悬停
        overstop: 1,
        showtit: 0,
        pagewrap: null,
        btnLoop: 1,
        wheel: 0,
        actclass: 'act'
    }
    Duang.prototype = {
        init : function() {
            var _self = this,
                o = _self.o,
                ppCss = {
                    position: 'relative',
                    overflow: 'hidden'
                },
                $obj, $objP, $objPP, attr, $cells, t;
            
            _self.index = o.index;
            attr        = o.dire == 'top' && 'height' || 'width';
            $obj        = _self.$obj;
            $objP       = $obj.parent();
            $objPP      = $objP.parent();
            
            if (_self.pages <= 1 || _self.len <= o.visible) return;
            if (!o.speed) {
                _self.effect = 'fade';
            }

            $obj.css({
                float : o.dire == 'top' ? 'none' : 'left'
            });
            // 每个单元的尺寸
            o.size = $obj[o.dire == 'top' ? 'outerHeight' : 'outerWidth'](true);
            // 加上作用域
            o.trigger += '.duang';

            switch(_self.effect){
                case 'fade' :
                    $obj.css({
                        display : 'none'
                    }).eq(o.index).show();

                    break;
                case 'fold' :
                    $obj.css({
                        position: 'absolute',
                        display: 'none',
                        left: 0,
                        top: 0
                    }).eq(o.index).show();

                    ppCss[attr] = o.size;
                    $objPP.css(ppCss);
                    break;
                case 'weibo' :
                    $objP.css('position', 'relative');
                    ppCss[attr] = o.size * o.visible;
                    $objPP.css(ppCss);
                    break;
                case 'Marqueue' :
                default :
                    var pCss = {
                            position: 'relative',
                            overflow: 'hidden'
                        };

                    pCss[o.dire] = -o.size * o.index;
                    pCss[attr] = 9999;

                    if (_self.effect) {
                        // 循环时处理
                        _self.$obj = $objP
                                    .append($obj.slice(0, o.visible).clone())
                                    .prepend($obj.slice($obj.length - o.visible).clone())
                                    .children();
                        // 定位到初始值
                        pCss[o.dire] = -(o.visible + o.index * o.steps) * o.size;
                        // marqueue
                        if (_self.effect == 'Marqueue') {
                            _self.s = -1;
                            // 滚动的总大小
                            _self.scrollSize = o.size * _self.len;
                        }
                    };
                    $objP.css(pCss);
                    
                    var $obj1 = $obj.eq(0);
                    // 计算多余的边距,让滚动外框两边对齐
                    var marginMore = parseInt($obj1.css('margin-' + o.dire)) - parseInt($obj1.css('margin-' + (o.dire == 'left' ? 'right' : 'bottom')));
                    ppCss[attr] = o.size * o.visible + marginMore;
                    
                    $objPP.css(ppCss);
            }

       /*     _self.setup();
        },
        setup: function() {
            var _self = this,
                o = _self.o,
                $obj, $objP, $objPP, attr, $cells, t;

            // 如果$cells存在,说明已经setup
            if (_self.$cells) return;

            $obj        = _self.$obj;
            $objP       = $obj.parent();
            $objPP      = $objP.parent();
            */
            // 分页
            if (o.cell && _self.effect != 'Marqueue') {

                $cells = _self.$element.find(o.cell).children();
                
                if ($cells.length) {
                    $cells = $cells.slice(0, _self.pages);
                } else {
                    var __html = [];
                    for (var i = 0; i < _self.pages; i++) {
                        __html.push('<i>' + (i + 1) + '</i>');
                    }
                    $cells = $(__html.join('')).appendTo(_self.$element.find(o.cell));
                }

                $cells.on(o.trigger, function() {
                        clearTimeout(t);
                        _self.loopNext = $cells.index(this);
                        t = setTimeout(function() {
                                _self.play(_self.loopNext);
                            }, o.delay)
                            //点击时阻止跳转
                        if (o.trigger == 'click.duang') return false;
                    })
                    .eq(_self.index).addClass(o.actclass);

                _self.$cells = $cells; 
            }; 

            // 自动播放
            if (!!o.autoplay) {
                _self.start();
                (!!o.overstop) && 
                    /*$objPP
                    .add($cells)
                    .add(o.prevbtn + ',' + o.nextbtn)
                    .on('mouseenter', $.proxy(_self.stop, _self))
                    .on('mouseleave', $.proxy(_self.start, _self))*/
                    _self.$obj
                    .add($cells)
                    .add(o.prevbtn && _self.effect != 'Marqueue' && o.prevbtn + ',' + o.nextbtn || null)
                    .on('mouseover', $.proxy(_self.stop, _self))
                    .on('mouseout', $.proxy(_self.start, _self))
            }

            // 显示标题
            if (!!o.showtit && o.visible == 1) {
                $objPP.after('<a class="tit-duang" target="_blank" href="' + $obj.eq(o.index).data('url') + '">' + $obj.eq(o.index).data('title') + '</a>')
            }
 
            // 页码
            if (o.pagewrap) {
                _self.$element.find(o.pagewrap).html(_self.index * 1 + 1 + '/' + _self.pages);
            }

            // 上一个下一个
            if (o.prevbtn) {
                _fnBtn('prev') && _fnBtn('next')
            }

            function _fnBtn(p) {
                var $pnBtn = _self.$element.find(o[p + 'btn']);
                !o.btnLoop && p == 'prev' && $pnBtn.addClass('disabled');
                $pnBtn.on(_self.effect == 'Marqueue' ? o.trigger : 'click', function() {
                    if ($(this).hasClass('disabled')) return;
                    _self.s = p == 'next' ? -1 : 1;
                    if (_self.effect == 'Marqueue') _self.next();
                    else _self[p]()
                }).attr({
                    unselectable : 'on'
                    , onselectstart : 'return false;'
                });
                return true;
            }
            if (_self.$objExt.length > o.index) {
                _self.$objExt.css('display','none').eq(o.index).show();
            }
        },
        destroy: function() {
            var _self = this,
                o = this.o;

            _self.stop();
            _self.$element.removeData('jqDuang');
            _self.$element.find(o.prevbtn + ',' + o.nextbtn).off('click mouseover')
            _self.$cells.off(o.trigger);
            delete _self.$cells;
        },
        start: function() {
            clearInterval(this.t1);
            this.t1 = setInterval($.proxy(this.next, this), this.o.interval);
        },
        stop: function() {
            clearInterval(this.t1);
        },
        next: function() {
            this.play(this.effect != 'Marqueue' && (this.loopNext = this.index + 1) % this.pages, 1);
        },
        prev: function() {
            this.loopNext = this.index - 1;
            this.play((this.loopNext + this.pages) % this.pages, 1);
        },
        play: function(next, isClick) {
            var _self    = this,
                o        = _self.o,
                $obj     = _self.$obj,
                $objP    = $obj.parent(),
                loopNext = _self.loopNext,
                pCss     = {},
                size     = o.size;

            if (_self.index == next && _self.effect != 'Marqueue') return;

            _self.$element.trigger('before.duang');
            switch(_self.effect){
                case 'fade' :
                    $obj.eq(_self.index).hide()
                    $obj.eq(next).animate({opacity: 'show'}, o.speed, o.easing);
                    break;
                case 'fold' :
                    $obj.stop(true, true).eq(_self.index)
                        .animate({
                            opacity: 'hide'
                        }, o.speed, o.easing);

                    $obj.eq(next)
                        .animate({
                            opacity: 'show'
                        }, o.speed, o.easing);
                    break;
                case 'Marqueue' :
                    $objP.css(o.dire, function(i, v) {
                        var offset = parseInt(v) + _self.s;
                        if (offset <= -_self.scrollSize) {
                            offset = 0;
                        } else if (offset >= 0) {
                            offset = -_self.scrollSize;
                        }
                        return offset;
                    });
                    break;
                case 'weibo' :
                        pCss[o.dire] = size * 9 / 8;

                        $objP.stop(true, true)
                            .animate(pCss, o.speed, o.easing, function() {
                                var oLi = $objP.children()[$obj.length - 1];
                                oLi.style.display = 'none';
                                $objP[0].insertBefore(oLi, $objP[0].children[0]);
                                $objP[0].style.top = 0;
                                $(oLi).fadeIn()
                            });
                    break;
                default :
                    var mm = 0, 
                        _mod = _self.len % o.steps,
                        offset;

                    if (_self.effect == 'Loop') {
                        /*if ($objP.is(':animated')) {
                            // return false;
                        }*/
                        // 第一页
                        if (_mod && loopNext == _self.pages) {
                            mm = _mod - o.steps;
                        }
                        // 最后一页
                        else if (_mod && loopNext == -1) {
                            mm = o.steps - _mod;
                        }
                        offset = loopNext * o.steps + o.visible + mm;
                        if (isClick) {
                            $objP.css(o.dire, -size * (this.index * o.steps + o.visible));
                        }
                    } else if (loopNext == _self.pages - 1 || loopNext == - 1) {
                        mm = _self.len - next * o.steps - o.visible
                    }

                    pCss[o.dire] = -size * (_self.effect == 'Loop' ? offset : next * o.steps + mm);

                    $objP.stop(true, false).animate(pCss, o.speed, o.easing);
                    pCss = null;
            } // switch end
            // 标题
            if(!!o.showtit && o.visible == 1) {
                var nextEleData = $obj.eq(next + (_self.effect == 'Loop' ? 1 : 0)).data();
                _self.$element.find('.tit-duang').html(nextEleData.title)[0].href = nextEleData.url;
            }
            // 分页
            if (o.pagewrap) {
                _self.$element.find(o.pagewrap).html(next + 1 + '/' + _self.pages);
            }
            // 控制按钮
            if (o.cell) {
                _self.$cells.removeClass(o.actclass).eq(next).addClass(o.actclass)
            }
            // 扩展对象, next过大时没有扩展对象,不执行
            if (_self.$objExt.length > next) {
                _self.$objExt.css('display','none').eq(next).show();
            }
            // 
            _self.index = next;
            // 按钮循环
            if (!o.btnLoop && o.prevbtn) {
                _self.$element.find(o.prevbtn + ',' + o.nextbtn).removeClass('disabled');
                next == 0 && _self.$element.find(o.prevbtn).addClass('disabled');
                next == _self.pages - 1 && _self.$element.find(o.nextbtn).addClass('disabled');
            }
            _self.$element.trigger('after.duang',[next]);
        }

    }

    function Plugin(option) {
        return option == 'index' ? this.data('jqDuang').index : this.each(function () {
            var $this   = $(this),
                data    = $this.data('jqDuang'),
                options = $.extend({}, Duang.DEFAULTS, $this.data(), typeof option == 'object' && option),
                p;

            if (!data) {
                if (option == 'destroy') {
                    return false;
                }
                $this.data('jqDuang', data = new Duang(this, options));
                data.init();
            }
            if (typeof option == 'string') {
                data[option]()
            } else if (typeof option == 'number') {
                data.play(data.loopNext = option)
            }
            options = null;
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
        $('[data-duang="1"]').each(function() {
            var $this = $(this);
            Plugin.call($this, $this.data())
        });
    })
}(jQuery, window);