//请求一个新的页面
function get(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var html = xhr.response;
			var body = html.match(/<body[\s\S]*?>[\s\S]*?<\/body>/gi);
			var h = body[0]
				.replace(/<body[\s\S]*?>|<\/body>/gi, '')
				.replace(/<script[\s\S]*?>[\s\S]*?(<\/script>)/gi, '')
				.replace(/<style[\s\S]*?>[\s\S]*?(<\/style>)/gi, '')
				.replace(/<iframe[\s\S]*?>[\s\S]*?(<\/iframe>)/gi, '')
				.replace(/style=(\"|\')[\s\S]*?(\"|\')/gi, '')
				.replace(/target=(\"|\')[\s\S]*?(\"|\')/gi, '')
				.replace(/onclick=\"[\s\S]*?\"/gi, '')
				.replace(/href=\"javascript:[\s\S]*?\"/gi, '')
				.replace(/\w+=(\"|\')(\"|\')/gi, '')
				.replace(/<!--[\s\S]*?(-->)/gi, '')
			callback(h);
		}
	}
	xhr.send();
}

function save(data) {

}

//从文本中匹配符合条件的数据
function getName(reg, val) {
	var regx = new RegExp(reg + "(：|:|\\s)*[\\s\\S]*?\\n", "ig");
	var repx = new RegExp("(" + reg + "(：|:|\\s)*)|\\n|\\s*$|^\\s*", "ig");
	var result = val.match(regx);
	if (result && result.length > 0) {
		return result[0].replace(repx, '')
	} else {
		return "";
	}
}

//实际业务处理
function getEtdown(p) {
	var page = p;
	get('http://www.etdown.net/index-' + page, function(html) {
		var dom = html
			.replace(/&nbsp;|\r|\t|\n|【推荐】→|【置顶】→|\[<a[\s\S]*?>[\s\S]*?(<\/a>\])|<\/?span[\s\S]*?>/gi, '')
			.replace(/\'/gi, '"').toLocaleLowerCase()
		var div = document.createElement('div');
		div.innerHTML = dom;
		var trArr = [];
		var tr = div.querySelectorAll("#xtable>tr");
		for (var i = 0; i < tr.length; i++) {
			if (tr[i].querySelectorAll("td").length == 5) {
				trArr.push({
					sub_page: tr[i].querySelectorAll("td")[2].querySelector("a").getAttribute('href').replace(/\.\//, 'http://www.etdown.net/')
				});
			}
		}
		//获取子页面数据
		function getSub(idx) {
			get(trArr[idx].sub_page, function(subHtml) {
				var content = document.createElement('div');
				content.innerHTML = subHtml;
				var side = content.querySelector('.side2');
				var downurl = content.querySelectorAll('[name=downurl] ul li [type=checkbox]');

				var sideTxt = side.innerText;

				delete trArr[idx].sub_page;
				trArr[idx]["zh_name"] = getName("中文名", sideTxt);
				trArr[idx]["createTime"] = getName("发布时间", sideTxt);
				trArr[idx]["type"] = getName("分\\s*类", sideTxt);
				trArr[idx]["poster"] = side.querySelector("img").getAttribute('src');
				trArr[idx]["translation"] = getName("译\\s*名", sideTxt);
				trArr[idx]["name"] = getName("(片|又)\\s*名", sideTxt);
				trArr[idx]["country"] = getName("地\\s*区|国\\s*家", sideTxt);
				trArr[idx]["language"] = getName("语\\s*言", sideTxt);
				trArr[idx]["year"] = getName("上映日期|年\\s*代", sideTxt);
				trArr[idx]["longTime"] = getName("片\\s*长", sideTxt);
				trArr[idx]["director"] = getName("导\\s*演", sideTxt);
				trArr[idx]["actor"] = getName("主\\s*演", sideTxt);
				trArr[idx]["subtitles"] = getName("字\\s*幕", sideTxt);
				trArr[idx]["wh"] = getName("视频尺寸", sideTxt);
				
				var desc = sideTxt.match(/((剧情\s*介绍|影片\s*简介)(：|:|\s)*)[\s\S]*?(花絮(：|:|\s)*)/);
				if (desc && desc.length > 0) {
					trArr[idx]["desc"] = desc[0].replace(/^((剧情\s*介绍|影片\s*简介)(：|:|\s)*)|(花絮(：|:|\s)*)$/g, '').replace(/^[\s\t\r\n]*|[\s\t\r\n]*$/g, '')
				} else {
					trArr[idx]["desc"] = "";
				}
				var imgs = side.querySelectorAll("img");
				var imgarr = [];
				imgs.forEach(function(v) {
					if (v && v.getAttribute('src')) {
						imgarr.push(v.getAttribute('src'));
					}
				});
				trArr[idx].covers = imgarr;

				console.log(trArr[idx])
				if (idx < trArr.length - 1) {
					++idx;
					getSub(idx);
				} else {
					console.log("第" + page + "页 " + trArr.length + "条");
					/*if(trArr.length==50){
						++page;
						getEtdown(page);
					}else{
						console.log("采集完毕");
					}*/
				}

			})
		}
		getSub(0);
	});
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.action == 'etdown') {
		getEtdown(1);
		sendResponse("aaaaa");
	}
});