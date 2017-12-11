chrome.runtime.onInstalled.addListener(function(){
    chrome.contextMenus.create({
        'id':'plum',
        'type':'normal',
        'title':'PlumGo Test',
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab){
    if(info.menuItemId == 'plum'){
        // {code:"var arr = ['http://www.baidu.com']; arr"}
        chrome.tabs.executeScript(tab.id, {file: "js/jquery-2.1.1.js"}, function(){
            chrome.tabs.executeScript(tab.id, {file: 'js/main.js'}, function(results){
                var list = results[0]
                if (list && list[0] && list[0].length && confirm('图片累计' + list[0].length + '张, 确认下载?')){
                    list[0].forEach(function(url) {
                        chrome.downloads.download({
                            url: url,
                            filename: list[1],
                            conflictAction: 'uniquify',
                            saveAs: false
                        });
                    });
                }
            });
        })
    }
});