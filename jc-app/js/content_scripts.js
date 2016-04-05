/*
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.action == 'a') {
		document.querySelector('input').value = request.msg;

		var evt = document.createEvent("MouseEvents");
		evt.initEvent("click", false, false);
		document.querySelector('[type="submit"]').dispatchEvent(evt);
	}
});*/
