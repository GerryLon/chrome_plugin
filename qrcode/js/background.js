chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url!="") {
        chrome.pageAction.show(tabId);
    }
});