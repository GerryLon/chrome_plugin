var btn = document.querySelector('.btn');
var input = document.querySelector('input');
btn.addEventListener('click', function() {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			action: "a",
			msg:input.value
		}, function(response) {});
	});
}, false);