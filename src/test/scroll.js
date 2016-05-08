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
        autoplay: 0,
        prevbtn: '.prev',
        nextbtn: '.next',
        visible: 3,
        steps: 3,
        // delay: 0,
        speed: 500,
        // btnLoop: 0,
        effect: 'leftLoop'
    };

    var $duang = $('#scroll').jqDuang(config);
    var jqDuang = $duang.data('jqDuang');
    var o = jqDuang.o;
    // console.log(jqDuang);

    QUnit.test('插件安装', function () {
        QUnit.notStrictEqual($.fn.jqDuang, undefined, 'passed!')
    })
    QUnit.test('插件执行', function () {
        QUnit.notStrictEqual(jqDuang, undefined, 'passed!')
    })
    /*test('参数配置', function () {
        $.each(config, function(i, val) {
            equal(jqDuang.o[i], val, 'passed!')
        });
    })*/
    $duang.on('after.duang', function(el, index) {
        QUnit.module('切换到第');
        test(index + 1 + '个', function () {
            QUnit.equal($duang.jqDuang('index'), index, 'passed!');
            // equal(jqDuang.$obj.parent().css(o.dire), -index * 560 + 'px', 'passed!');
            /* Act on the event */
        })
    });
    $('#destroy').click(function(event) {
        /* Act on the event */
        $duang.jqDuang('destroy');
        o.visible = 2;
        o.steps = 2;

    });
    $('#setup').click(function(event) {
        /* Act on the event */
        $duang.jqDuang('init');
        return false;
    });
});
