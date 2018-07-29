// Modified WITH PAIN from code found on
// https://stackoverflow.com/questions/25467009/internationalization-of-html-pages-for-my-google-chrome-extension

function replace_i18n(obj, tag) {

  //console.log("replace_i18n got ", obj, " and tag ", tag);

  var msg = browser.i18n.getMessage(tag);

  //console.log("found msg: ", msg);

  if(msg) {
    obj.textContent = msg;
  }


  //var msg = tag.replace(/__MSG_(\w+)__/g, function(match, v1) {
  //    return (v1 ? browser.i18n.getMessage(v1) : '');
  //});

  //console.log("replace_i18n now has msg: ", msg, " and tag: ", tag);

  //if(msg != tag) obj.textContent = msg;
}

function localiseHtmlPage() {
  // Localize using __MSG_***__ data tags
  var data = document.querySelectorAll('[data-localize]');

  //console.log("localiseHtmlPage");
  //console.log(data);
  //console.log(browser.i18n.getUILanguage());

  for (var i in data) if (data.hasOwnProperty(i)) {
    var obj = data[i];
    var tag = obj.getAttribute('data-localize').toString();

    //console.log("localiseHtmlPage found obj: ", obj, " with tag: ", tag);

    replace_i18n(obj, tag);
  }

  // Localise everything else by replacing all __MSG_***__ tags
  var page = document.getElementsByTagName('html');

  for (var j = 0; j < page.length; j++) {
    var obj = page[j];
    var tag = obj.innerHTML.toString();

    replace_i18n(obj, tag);
  }
}

//console.log("localise.js");

localiseHtmlPage();
