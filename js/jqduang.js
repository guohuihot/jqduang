/*!
* @author : ahuing
* @date   : 2015-04-10
* @name   : jqduang.js v1.15
* @modify : 2016-04-21 01:41:22
 */
!function($){function e(e){return"index"==e?this.data("jqDuang").index:this.each(function(){var t=$(this),i=t.data("jqDuang"),n="object"==typeof e&&e;i||(t.data("jqDuang",i=new s(this,n)),i.init()),"string"==typeof e?i[e]():"number"==typeof e&&i.play(i.loopNext=e)})}var t,s=function(e,t){this.o=$.extend({},s.defaults,t),this.$self=$(e);var i=this.o.obj.split("|");this.$obj=this.$self.find(i[0]),this.$objExt=$(i[1]),this.$obj.length||(this.$obj=this.$objExt,this.$objExt=[]),this.dire=$.inArray(this.o.effect,["left","leftLoop","leftMarqueue"])<0&&"top"||"left",this.objAttr="top"==this.dire&&"height"||"width",this.index=this.o.index,this.effect=this.o.effect.replace(this.dire,""),this.L=this.$obj.length,this.pages=!this.effect&&Math.ceil((this.L-this.o.visible)/this.o.steps)+1||Math.ceil(this.L/this.o.steps),this.WH={width:this.$obj.outerWidth(!0),height:this.$obj.outerHeight(!0)}};s.defaults={obj:"li",cell:"",trigger:"mouseover",effect:"fade",speed:500,index:0,autoplay:1,interval:3e3,prevbtn:"",nextbtn:"",delay:150,easing:"swing",visible:1,steps:1,overstop:1,showtit:0,pagewrap:"",btnLoop:1,wheel:0,actclass:"act"},s.prototype={init:function(){function e(e){var t=f.$self.find(d[e+"btn"]);return!(1*d.btnLoop)&&"prev"==e&&t.addClass("disabled"),t["Marqueue"==f.effect?d.trigger:"click"](function(){$(this).hasClass("disabled")||(f.s="next"==e?-1:1,"Marqueue"==f.effect?f.next():f[e]())}).attr({unselectable:"on",onselectstart:"return false;"}),!0}var t,s,i,n,a,o,l,r,f=this,d=f.o,c=f.$obj,p=c.parent(),h=p.parent();if(!(f.pages<=1||f.L<=d.visible)){switch(!d.speed&&(f.effect="fade"),f.effect){case"fade":c.css({display:"none"}).eq(d.index).show();break;case"fold":c.css({position:"absolute",display:"none",left:0,top:0}).eq(d.index).show(),t=f.WH,t["position"]="relative",h.css(t);break;case"weibo":p.css("position","relative"),t={position:"relative",overflow:"hidden"},t[f.objAttr]=f.WH[this.objAttr]*d.visible,h.css(t);break;case"Marqueue":default:c.css({"float":"top"==f.dire?"none":"left"}),s={position:"relative",overflow:"hidden"},s[f.dire]=-f.WH[f.objAttr]*d.index,s[f.objAttr]=9999,f.effect&&(f.$obj=p.append(c.slice(0,d.visible).clone()).prepend(c.slice(c.length-d.visible).clone()).children(),s[f.dire]=-(d.visible+d.index*d.steps)*f.WH[f.objAttr],"Marqueue"==f.effect&&(f.s=-1,f.scrollSize=f.WH[f.objAttr]*f.L)),p.css(s),t={overflow:"hidden",position:"relative"},i=c.eq(0),n=parseInt(i.css("margin-"+this.dire))-parseInt(i.css("margin-"+("left"==this.dire?"right":"bottom"))),t[f.objAttr]=f.WH[f.objAttr]*d.visible+n,h.css(t)}if(d.cell&&"Marqueue"!=f.effect){if(o=d.cell.split("|"),f.$cells=o.length>1?f.$self.find(o[1]):f.$self.find(o[0]).children(),f.$cells.length)f.$cells=f.$cells.slice(0,f.pages);else{for(l="",r=0;r<f.pages;r++)l+="<i>"+(r+1)+"</i>";f.$cells=$(l).appendTo(f.$self.find(o[0]))}f.$cells[d.trigger](function(){return clearTimeout(a),f.loopNext=f.$cells.index(this),a=setTimeout(function(){f.play(f.loopNext)},d.delay),"click"==d.trigger?!1:void 0}).eq(f.index).addClass(d.actclass)}1*d.autoplay&&(f.start(),1*d.overstop&&f.$obj.add(f.$cells).add(d.prevbtn&&"Marqueue"!=f.effect&&d.prevbtn+","+d.nextbtn||null).on("mouseover",$.proxy(f.stop,f)).on("mouseout",$.proxy(f.start,f))),1*d.showtit&&1==d.visible&&h.after('<a class="tit-duang" target="_blank" href="'+c.eq(d.index).data("url")+'">'+c.eq(d.index).data("title")+"</a>"),d.pagewrap&&f.$self.find(d.pagewrap).html(1*f.index+1+"/"+f.pages),d.prevbtn&&e("prev")&&e("next"),1*d.wheel&&$.fn.mousewheel&&h.mousewheel(function(e,t){clearTimeout(a),a=setTimeout(function(){f[t>0?"prev":"next"]()},100)}),f.$objExt.length>d.index&&f.$objExt.css("display","none").eq(d.index).show()}},start:function(){clearInterval(this.t1),this.t1=setInterval($.proxy(this.next,this),this.o.interval)},stop:function(){clearInterval(this.t1)},next:function(){this.play("Marqueue"!=this.effect&&(this.loopNext=this.index+1)%this.pages)},prev:function(){this.loopNext=this.index-1,this.play((this.loopNext+this.pages)%this.pages)},play:function(e){var t,s,i,n,a,o,l=this,r=l.o,f=l.$obj,d=f.parent(),c=l.loopNext;if(l.index!=e||"Marqueue"==l.effect){switch(l.$self.trigger("beforeFun"),l.effect){case"fade":f.eq(l.index).hide(),f.eq(e).animate({opacity:"show"},r.speed,r.easing);break;case"fold":f.stop(!0,!0).eq(l.index).animate({opacity:"hide"},r.speed,r.easing),f.eq(e).animate({opacity:"show"},r.speed,r.easing);break;case"Marqueue":d.css(l.dire,function(e,t){var s=parseInt(t)+l.s;return s<=-l.scrollSize?s=0:s>=0&&(s=-l.scrollSize),s});break;case"weibo":t={},t[l.dire]=9*l.WH[l.objAttr]/8,d.stop(!0,!0).animate(t,r.speed,r.easing,function(){var e=d.children()[f.length-1];e.style.display="none",d[0].insertBefore(e,d[0].children[0]),d[0].style.top=0,$(e).fadeIn()});break;default:if(s=0,"Loop"==this.effect){if(d.is(":animated"))return!1;n=l.L%r.steps,n&&c==l.pages?s=n-r.steps:n&&-1==c&&(s=r.steps-n),i=c*r.steps+r.visible+s,a=function(){d.css(l.dire,-l.WH[l.objAttr]*(e*r.steps+r.visible))}}else(c==l.pages-1||-1==c)&&(s=l.L-e*r.steps-r.visible);t={},t[l.dire]=-l.WH[l.objAttr]*("Loop"==this.effect?i:e*r.steps+s),d.stop(!0).animate(t,r.speed,r.easing,a)}1*r.showtit&&1==r.visible&&(o=f.eq(e+("Loop"==this.effect?1:0)).data(),l.$self.find(".tit-duang").html(o.title)[0].href=o.url),r.pagewrap&&l.$self.find(r.pagewrap).html(e+1+"/"+l.pages),r.cell&&l.$cells.removeClass(r.actclass).eq(e).addClass(r.actclass),l.$objExt.length>e&&l.$objExt.css("display","none").eq(e).show(),l.index=e,1*r.btnLoop||!r.prevbtn||(l.$self.find(r.prevbtn+","+r.nextbtn).removeClass("disabled"),0==e&&l.$self.find(r.prevbtn).addClass("disabled"),e==l.pages-1&&l.$self.find(r.nextbtn).addClass("disabled")),l.$self.trigger("afterFun",[e])}}},t=$.fn.jqDuang,$.fn.jqDuang=e,$.fn.jqDuang.Constructor=s,$.fn.jqDuang.noConflict=function(){return $.fn.jqDuang=t,this},$(window).on("load",function(){$(".jqDuang").each(function(){var t=$(this);e.call(t,t.data())})})}(jQuery);