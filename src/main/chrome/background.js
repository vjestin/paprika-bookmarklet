function skipProtocol(url) {
	return url.substring(url.indexOf("/"));
}

function bookmarkletIsKnown() {
	return localStorage.getItem("bookmarklet") != null;
}

function urlAlreadySaved(url) {
	return localStorage.getItem(skipProtocol(url)) != null;
}

function onSavePaprikaRecipeClick() {

	if(bookmarkletIsKnown()) {
		savePaprikaRecipe();
	} else {
		requestBookmarklet();
	}

}

function requestBookmarklet() {
	chrome.tabs.query(
		{active: true, currentWindow: true},
		function(tabs) {
			if( tabs.length != 1 ) return;
			var tab = tabs[0];

			chrome.tabs.sendMessage(
				tab.id,
				{ action: "REQUEST_PAPRIKA_BOOKMARKLET" },
				null,
				function(response) {}
			);
		}
	);
}

function savePaprikaRecipe() {

	var bookmarklet = localStorage.getItem("bookmarklet");

	chrome.tabs.query(
		{active: true, currentWindow: true},
		function(tabs) {
			if( tabs.length != 1 ) return;
			var tab = tabs[0];

			chrome.tabs.sendMessage(
				tab.id,
				{ action: "SAVE_PAPRIKA_RECIPE", data: bookmarklet }
			);

			if(tab.url && tab.url != "" && urlAlreadySaved(tab.url)) {
				chrome.tabs.sendMessage(
					tab.id,
					{ action: "ALREADY_SAVED_PAPRIKA_RECIPE" }
				);
			}
			localStorage.setItem(skipProtocol(tab.url), 1);
		}
	);
}

chrome.browserAction.onClicked.addListener(onSavePaprikaRecipeClick);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

	if(message.action == "SAVE_PAPRIKA_BOOKMARKLET") {
			localStorage.setItem("bookmarklet", message.data);

			chrome.tabs.getSelected(
				null,
				function(tab) {
					if( !tab ) return;
					chrome.tabs.sendMessage(
						tab.id,
						{ action: "CLOSE_COLORBOX" },
						null,
						function(response) {}
					);
				}
			);

			savePaprikaRecipe();
	}

});
