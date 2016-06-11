! function($, window, document) {

    $.fn.serializeObject = function() {
        var o = {},
            a = this.serializeArray();

        $.each(a, function() {
            this.value = this.value.match('[0-9]+') ? this.value * 1 : this.value;
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var initEffect = function(fm) {
        var $form = $(fm),
            tag = $form.data().tag;

        $('.' + tag + '-wrap').empty().load('tpl_' + tag + '.html', function() {
            var option = $form.serializeObject();
            console.log(option);
            $(this).find('.' + tag).jqDuang(option)
        });
    }

    $('form[data-tag]')
        .on('change', 'select', function() {
            initEffect(this.form);
        })
        .each(function(i, el) {
            initEffect(el);
        });
}(jQuery, window, document);