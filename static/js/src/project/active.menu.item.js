$(function () {
    var location = window.location.href;
    var cur_url = '/' + location.split('/').pop();

    var cur_found = false;
    $('li.nav-item').each(function () {
        var link = $(this).find('a').attr('href');
        if (cur_url === link) {
            $(this).addClass('active');
            cur_found = true;


        }
    });
    //TODO: Доделать активные пункты в подменю
    if (!cur_found) {
        $('ul.treeview-menu li a').each(function () {
            var link = $(this).attr('href');
            if (cur_url === link)
                $(this).addClass('active');
                $(this).parent('.nav-item').addClass('active');

        });
    }
});