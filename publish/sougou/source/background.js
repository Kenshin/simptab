var myfavrite = "\u65b0\u6807\u7b7e\u9875 - \u6211\u7684\u6700\u7231"; //新标签页 - 我的最爱
var aboutblank = "\u7a7a\u767d\u9875"; //空白页
var sitesworld = "\u65b0\u6807\u7b7e\u9875 - \u7f51\u5740\u5927\u5168";  //新标签页 - 网址大全
var fullSearch = '\u65b0\u6807\u7b7e\u9875 - \u5168\u80fd\u641c\u7d22';  //新标签页 - 全能搜索

var url = sogouExplorer.extension.getURL( "" )  +  "main.html";
sogouExplorer.browserAction.onClicked.addListener(function (tab) {
    sogouExplorer.tabs.create({
        url: url,
        selected: true
    });
});
sogouExplorer.tabs.onCreated.addListener(function (tab) {
    if (tab.title == myfavrite || tab.title == aboutblank || tab.title == sitesworld || tab.title == fullSearch) {
        sogouExplorer.tabs.update(tab.id, {
            url: url,
            selected: true
        });
    }
});