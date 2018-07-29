// Modified WITH TEARS, PAIN AND SHOUTING from code found on
// https://stackoverflow.com/questions/25467009/internationalization-of-html-pages-for-my-google-chrome-extension

function replace_i18n(obj, tag) {
  var msg = browser.i18n.getMessage(tag);
  if(msg) {
    obj.textContent = msg;
  }
}

function localiseHtmlPage() {
  // Localize using __MSG_***__ data tags
  var data = document.querySelectorAll('[data-localize]');
  for (var i in data) if (data.hasOwnProperty(i)) {
    var obj = data[i];
    var tag = obj.getAttribute('data-localize').toString();
    replace_i18n(obj, tag);
  }
}

localiseHtmlPage();
