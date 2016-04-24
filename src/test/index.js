/*!
 * @name <%= name %>
 * @author <%= author %>
 * @date <%= date %>
 */
$(window).on('load', function(event) {
    event.preventDefault();
    /* Act on the event */
    var config = {
        obj: 'li',
        cell: '.thumb',
        // autoplay: 0,
        prevbtn: '.prev',
        nextbtn: '.next',
        visible: 1,
        steps: 1,
        delay: 0,
        showtit: 1,
        effect: 'left'
    };

    var $duang = $('#slide').jqDuang(config);
    var jqDuang = $duang.data('jqDuang');
    var o = jqDuang.o;
    console.log(jqDuang);

    test('插件安装', function () {
        notStrictEqual($.fn.jqDuang, undefined, 'passed!')
    })
    test('插件执行', function () {
        notStrictEqual(jqDuang, undefined, 'passed!')
    })
    /*test('参数配置', function () {
        $.each(config, function(i, val) {
            equal(jqDuang.o[i], val, 'passed!')
        });
    })*/
    $duang.on('after.duang', function(el, index) {
        module('切换到第');
        test(index + 1 + '个', function () {
            equal($duang.jqDuang('index'), index, 'passed!');
            // equal(jqDuang.$obj.parent().css(o.dire), -index * 560 + 'px', 'passed!');
            /* Act on the event */
        })
    });
});
