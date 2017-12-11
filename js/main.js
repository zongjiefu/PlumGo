// 数组去重
Array.prototype.unique = function(){
    var res = [];
    var json = {};
    for(var i = 0; i < this.length; i++){
        if(!json[this[i]]){
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}

// 滚动到底部
function scrollToEnd(){
    var h = $(document).height()-$(window).height();
    $(document).scrollTop(h); 
}

// 远程获取图片信息
function getPicInfo(url){
    var img = new Image();
    img.src = url;
    img.onerror = function(){
        return false;
    };

    if(img.complete){
        return {'width': img.width, 'height': img.height};
    } else {
        img.onload = function(){
            img.onload=null;
            return {'width': img.width, 'height': img.height};
        }
    }

    return false;
}

// 批量检测图片大小
function checkPicSize(list, check_http=true) {
    var items = [];
    for (var i = 0; i < list.length; i++) {
        if (typeof(list[i]) == "undefined") {
            continue;
        }
        if (list[i].indexOf('https:') == -1 && check_http) {
            list[i] = 'https:' + list[i];
        }
        var size = getPicInfo(list[i]);
        if (size && (size.width >= 300 && size.height >= 300)) {
            items.push(list[i]);
        }
    }

    return items;
}

// 1688
function parse1688(url, domain) {
    var list = [], art_no = '';
    var match = url.match(/(\d+)\.html/);

    $('.obj-content table .de-feature').each(function(){
        if ($(this).text().indexOf('货号') >= 0) {
            art_no = $(this).next().text().trim();
        }
    })

    $('#dt-tab ul li img').each(function(){
        list.push($(this).attr('src').replace('.60x60', ''));
    });

    $('.offerdetail_w1190_description img').each(function(){
        list.push($(this).attr('src'));
    });

    $('#mod-detail-description img').each(function(){
        list.push($(this).attr('src'));
    });

    result[0] = checkPicSize(list.unique());
    result[1] = domain + '/' + match[1] + '-' + art_no + '/pic.jpg';
}

// tianMao
function parseTianMao(url, domain) {
    var list = [], art_no = '';
    var match = url.match(/id=(\d+)/);

    $('#J_AttrUL li').each(function(){
        if ($(this).text().indexOf('货号') >= 0) {
            art_no = $(this).attr('title').trim();
        }
    });

    $('#J_UlThumb li img').each(function(){
        list.push($(this).attr('src').replace('_60x60q90.jpg', ''));
    });

    $('#description div img[src^="http"]').each(function(){
        list.push($(this).attr('src'));
    });

    result[0] = checkPicSize(list.unique());
    result[1] = domain + '/' + match[1] + '-' + art_no + '/pic.jpg';
}

// taoBao
function parseTaoBao(url, domain) {
    var list = [], art_no = '';
    var node_id = $('input[name="item_id"]').attr('value');

    $('#attributes li').each(function(){
        if ($(this).text().indexOf('货号') >= 0) {
            art_no = $(this).attr('title').trim();
        }
    });

    $('#J_UlThumb li img').each(function(){
        list.push($(this).attr('src').replace('_50x50.jpg', ''));
    });

    $('#J_DivItemDesc img[src^="http"]').each(function(){
        list.push($(this).attr('src'));
    });

    result[0] = checkPicSize(list.unique());
    result[1] = domain + '/' + node_id + '-' + art_no + '/pic.jpg';
}

// Common
function parseCommon(url, domain) {
    var list = [];
    $('img[src^="http"]').each(function(){
        list.push($(this).attr('src'));
    });

    result[0] = checkPicSize(list.unique(), false);
    result[1] = domain + '/' + Date.parse(new Date()) + '/pic.jpg';
}

// scrollToEnd();

var result = [];
var url = window.location.href;
var domain = window.location.host;

if (url.indexOf('detail.1688.com') >= 0) {
    setTimeout(parse1688(url, domain), 20000);
} else if (url.indexOf('detail.tmall.com') >= 0) {
    setTimeout(parseTianMao(url, domain), 20000);
} else if (url.indexOf('item.taobao.com') >= 0) {
    setTimeout(parseTaoBao(url, domain), 20000);
} else {
    setTimeout(parseCommon(url, domain), 20000);
}

console.log(result)
result;
