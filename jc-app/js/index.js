/*
 var btn = document.querySelector('.btn');
 var input = document.querySelector('input');
 btn.addEventListener('click', function() {
 chrome.tabs.getSelected(null, function(tab) {
 chrome.tabs.sendRequest(tab.id, {
 action: "a",
 msg:input.value
 }, function(response) {});
 });
 }, false);*/

/*
 chrome.runtime.sendMessage('Hello', function(response){
 document.body.innerHTML = response;
 });*/

var APISTORE_APIKEY = "3df298de5351de6d19084f272dd46f43";
var TULING_APIKEY = "39725a1b594f6135446f9565db825780";
function ajax(url, callback, header, post, data) {
    var xhr = new XMLHttpRequest();
    xhr.open(post || "GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    if (header) {
        xhr.setRequestHeader('apikey', APISTORE_APIKEY);
    }
    var d = post ? JSON.stringify(data) : null
    xhr.send(d);
}
function query(selector) {
    return document.querySelector(selector);
}
function queryAll(selector) {
    return document.querySelectorAll(selector);
}
(function () {
    //切换tab
    'use strict';
    var items = queryAll(".flex-item");
    for (var i = 0; i < items.length; i++) {
        var v = items[i];
        if (v.getAttribute('default') == 1) {
            query('.' + v.getAttribute('show')).style.display = "block";
        }
        v.addEventListener('click', function () {
            var show = this.getAttribute('show');
            var defaultShow = this.getAttribute('default');
            var reg = new RegExp(show, 'gi');
            var contents = queryAll(".content .content-item");
            for (var j = 0; j < contents.length; j++) {
                var vv = contents[j];
                if (reg.test(vv.className)) {
                    vv.style.display = 'block';
                } else {
                    vv.style.display = 'none';
                }
            }
        }, false);
    }
})();


(function () {
    //生成二维码
    query("#getqrcode").addEventListener('click', function () {
        var img = "http://qr.liantu.com/api.php?text=" + query("#qrcode").value;
        query("#qrcodeimg").src = img;
    }, false)
})();
(function () {
    //手机号归属地查询
    'use strict';
    query("#gettel").addEventListener('click', function () {
        var tel = query("#tel").value;
        if (/^1[34578][0-9]{9}$/.test(tel)) {
            ajax("http://apis.baidu.com/apistore/mobilephoneservice/mobilephone?tel=" + tel, function (d) {
                var obj = JSON.parse(d);
                if (obj.errNum == 0) {
                    query('#tel-txt').innerHTML = JSON.stringify(obj.retData, null, 4);
                } else {
                    query('#tel-txt').innerHTML = "获取失败";
                }
            }, 1);
        } else {
            query('#tel-txt').innerHTML = "手机号码格式错误";
        }

    }, false)

})();
(function () {
    //天气查询
    'use strict';
    var city = query("#weather");
    //自动获取当前ip
    ajax('http://sneezryworks.sinaapp.com/ip.php', function (ip) {
        //根据ip获取城市名称
        ajax("http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=" + encodeURI(ip), function (d) {
            var obj = JSON.parse(d);
            if (obj.errNum == 0) {
                //根据城市，获取天气情况
                city.value = obj.retData.city;
                ajax("http://apis.baidu.com/apistore/weatherservice/recentweathers?cityname=" + encodeURI(obj.retData.city), function (d) {
                    var wea = JSON.parse(d);
                    if (wea.errNum == 0) {
                        query('#weather-txt').innerHTML = JSON.stringify(wea.retData, null, 4);
                    } else {
                        query('#weather-txt').innerHTML = "获取失败";
                    }
                }, 1);
            } else {
                query('#weather-txt').innerHTML = "获取失败";
            }
        }, 1);
    });
    query("#getweather").addEventListener('click', function () {
        ajax("http://apis.baidu.com/apistore/weatherservice/recentweathers?cityname=" + encodeURI(city.value), function (d) {
            var obj = JSON.parse(d);
            if (obj.errNum == 0) {
                query('#weather-txt').innerHTML = JSON.stringify(obj.retData, null, 4);
            } else {
                query('#weather-txt').innerHTML = "获取失败";
            }
        }, 1);

    }, false)

})();
(function () {
    //身份证查询
    'use strict';
    query("#getidcard").addEventListener('click', function () {
        var id = query("#idcard").value;
        ajax("http://apis.baidu.com/apistore/idservice/id?id=" + encodeURI(id), function (d) {
            var obj = JSON.parse(d);
            if (obj.errNum == 0) {
                query('#idcard-txt').innerHTML = JSON.stringify(obj.retData, null, 4);
            } else {
                query('#idcard-txt').innerHTML = "获取失败";
            }
        }, 1);
    }, false)
})();
(function () {
    //身份证查询
    'use strict';
    var val = query("#aqi");
    ajax('http://sneezryworks.sinaapp.com/ip.php', function (ip) {
        //根据ip获取城市名称
        ajax("http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=" + encodeURI(ip), function (d) {
            var obj = JSON.parse(d);
            if (obj.errNum == 0) {
                //根据城市，获取天气情况
                val.value = obj.retData.city;
                ajax("http://apis.baidu.com/apistore/aqiservice/aqi?city=" + encodeURI(obj.retData.city), function (d) {
                    var aqi = JSON.parse(d);
                    if (aqi.errNum == 0) {
                        query('#aqi-txt').innerHTML = JSON.stringify(aqi.retData, null, 4);
                    } else {
                        query('#aqi-txt').innerHTML = "获取失败";
                    }
                }, 1);
            } else {
                query('#weather-txt').innerHTML = "获取失败";
            }
        }, 1);
    });
    query("#getaqi").addEventListener('click', function () {
        ajax("http://apis.baidu.com/apistore/aqiservice/aqi?city=" + encodeURI(val.value), function (d) {
            var obj = JSON.parse(d);
            if (obj.errNum == 0) {
                query('#aqi-txt').innerHTML = JSON.stringify(obj.retData, null, 4);
            } else {
                query('#aqi-txt').innerHTML = "获取失败";
            }
        }, 1);
    }, false)
})();


(function () {
    //每日一乐
    'use strict';
    query("#gethappy").addEventListener('click', function () {
        ajax("http://apis.baidu.com/myml/c1c/c1c?id=-1", function (d) {
            var obj = JSON.parse(d);
            if (obj.Id) {
                query('#happy-txt').innerHTML =
                    '<details>' +
                    '<summary>' + obj.Title.replace(/\s+/g, ' ') + '<small class="text-red">(展开答案)</small></summary>' +
                    '<p>' + obj.Answer + '</p>' +
                    '</detalis>';

            } else {
                query('#happy-txt').innerHTML = "获取失败";
            }
        }, 1);
    }, false)
})();

(function () {
    //公交
    'use strict';
    query("#getbus").addEventListener('click', function () {
        var city = query('#bus_city').value;
        var bus_bus = query('#bus_bus').value.replace(/路/g, '');
        var bus_direction = query('#bus_direction').value;
        ajax("http://apis.baidu.com/xiaota/bus_lines/buses_lines?city=" + city + "&bus=" + bus_bus + "&direction=" + bus_direction, function (d) {
            console.log(d)
            var obj = JSON.parse(d);
            if (obj.code == 1000) {
                query('#bus-txt').innerHTML = JSON.stringify(obj.data, null, 4);

            } else {
                query('#bus-txt').innerHTML = "获取失败";
            }
        }, 1);
    }, false)
})();

(function () {
    //公交
    'use strict';
    query("#getshorturl").addEventListener('click', function () {
        var url = query('#shorturl').value;
        var type = query('#shorturl_type').value;
        ajax("http://apis.baidu.com/chazhao/shorturl/shorturl", function (d) {
            var obj = JSON.parse(d);
            if (obj.error == 0) {
                query('#shorturl-txt').innerHTML = JSON.stringify(obj.data, null, 4);
            } else {
                query('#shorturl-txt').innerHTML = "获取失败";
            }
        }, 1, "POST", {
            "type": type,
            "url": [url]
        });
    }, false)
})();
(function () {
    //机器人
    'use strict';
    query("#getrobot").addEventListener('keyup', function (e) {
        var self = this;
        console.log(e)
        if (e.keyCode == 13) {
            var msg = self.value;
            self.value = "";
            var p1 = document.createElement('p');
            p1.innerHTML = msg;
            query('#msg-content').appendChild(p1);
            ajax("http://www.tuling123.com/openapi/api?key=" + TULING_APIKEY + "&userid=1&info=" + msg, function (d) {
                var obj = JSON.parse(d);
                var p2 = document.createElement('p');
                p2.innerHTML = obj.text;
                p2.style.color = "#c00";
                query('#msg-content').appendChild(p2);
                query('#msg-content').parentNode.scrollTop += 100;
            });
        }
    }, false)
})();
(function () {
    //ip查询
    'use strict';
    var input = query('#ip');
    ajax('http://sneezryworks.sinaapp.com/ip.php', function (ip) {
        input.value = ip
        //根据ip获取城市名称
        ajax("http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=" + encodeURI(ip), function (d) {
            var obj = JSON.parse(d);
            if (obj.errNum == 0) {
                query('#ip-txt').innerHTML = '<p>ip：'+obj.retData.ip+'</p>'+
                    '<p>城市：'+obj.retData.city+obj.retData.district+'</p>'+
                    '<p>运营商：'+obj.retData.carrier+'</p>';
            } else {
                query('#ip-txt').innerHTML = "获取失败";
            }
        }, 1);
    });
    query("#getip").addEventListener('click', function (e) {
        ajax("http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=" + encodeURI(input.value), function (d) {
            var obj = JSON.parse(d);
            if (obj.errNum == 0) {
                query('#ip-txt').innerHTML = '<p>ip：'+obj.retData.ip+'</p>'+
                    '<p>城市：'+obj.retData.city+obj.retData.district+'</p>'+
                    '<p>运营商：'+obj.retData.carrier+'</p>';
            } else {
                query('#ip-txt').innerHTML = "获取失败";
            }
        }, 1);
    }, false)
})();