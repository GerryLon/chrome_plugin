// ==UserScript==
// @name         ad-baidu
// @namespace    https://baidu.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.baidu.com/**
// @grant        none
// ==/UserScript==
var selectors = `
#content_left [style*="display:block !important;visibility:visible !important"]
[tpl="right_toplist"]
[class="c-gray c-feedback"]
[data-click*="vLevel"]
`;
selectors = selectors.trim().split('\n');
var count = 0;
function showCount(cn){
    if(cn>0){
        count+=cn;
        var content_right = document.querySelector('#content_right');
        if(content_right){
            content_right.style.position = 'relative';
            var style = `
line-height: 42px;
text-align: center;
background: #0c0;
color: #fff;
margin-bottom:30px;
`;
            var msgCount = document.querySelector('#msg-remove');
            if(!msgCount){
                content_right.insertAdjacentHTML('afterbegin','<div id="msg-remove" style="'+style+'"></div>');
                msgCount = document.querySelector('#msg-remove');
            }
            msgCount.innerHTML = '已过滤：'+count+'条垃圾广告，本次过滤：'+cn+'条';
        }
    }
}
function clear() {
    selectors.forEach(function(selector) {
        var doms = document.querySelectorAll(selector);
        if(doms.length){
            doms = Array.from(doms);
            showCount(doms.length);
            doms.forEach(function(dom) {
                dom.parentNode.removeChild(dom);
            });
        }
    });
}
setInterval(function () {
    clear();
},500);
