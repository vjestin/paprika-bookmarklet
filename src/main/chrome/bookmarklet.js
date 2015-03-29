$(function() {

  $(document).ready(function() {

    bookmarklet = $('pre');
    if(bookmarklet.length != 0) {

      chrome.runtime.sendMessage({
        action: "SAVE_PAPRIKA_BOOKMARKLET",
        data: bookmarklet.text()
      });
    }
  });

});
