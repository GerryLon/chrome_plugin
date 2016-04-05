var btn = document.querySelector('.btn');
btn.addEventListener('click', function() {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			action: "etdown",
			msg:"aa"
		}, function(response) {
			document.querySelector('pre').innerText = response;
		});
	});
}, false);