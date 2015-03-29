
$(function() {

	function getHighestIndex() {
		var highest = -999;

		$("*").each(function() {
    	var current = parseInt($(this).css("z-index"), 10);
    	if(current && highest < current) highest = current;
		});
		return highest;
	}

	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

		if(message.action == "SAVE_PAPRIKA_RECIPE") {

			eval(message.data.substring("javascript:".length));

		} else if(message.action == "ALREADY_SAVED_PAPRIKA_RECIPE") {

			$("<div class='paprika-bookmarklet-msg'>" + chrome.i18n.getMessage('already_saved') + "</div>")
			.css("z-index", getHighestIndex()+1)
			.prependTo("body")
			.delay(3000)
			.fadeOut(400, function() {
				$(".paprika-bookmarklet-msg").remove();
			});

		} else if (message.action == "REQUEST_PAPRIKA_BOOKMARKLET") {

			$("<style>#colorbox, #cboxOverlay, #cboxWrapper {z-index: " + (getHighestIndex()+1) + "}</style>").appendTo("body");
			$.colorbox({html: "<div id='paprika-bookmarklet'><iframe src='https://paprikaapp.com/bookmarklet/'></iframe></div>"});

		} else if (message.action == "CLOSE_COLORBOX") {

			$.colorbox.close();
		}


	});

});
