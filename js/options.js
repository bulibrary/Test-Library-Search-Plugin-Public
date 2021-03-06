//Google Analytics

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-101158084-3']);
_gaq.push(['_trackPageview']);
(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();



//SEARCHBOX STUFF
$(document).ready(function () {
    //select library catalogue as default
    $("#library").prop("checked", true);
    //when clicking search, adapt the URL depending on selection made
    $('#btnOpenNewTab').click(function () {
        //Get the search term, and save it as a var
        var searchstring = $('input#searchInput').val();
        //Library Catalogue
        if (
            $('#library').is(":checked")) {
            //change this url to match your library's! Here is Leiden's URL as an example for ExLibris Primo users - Old UI!
            var newLibraryURL = 'https://apac-tc.hosted.exlibrisgroup.com/primo-explore/search?vid=BOND&tab=default_tab&search_scope=all_resources&lang=en_US&offset=0&query=any,contains,' + searchstring + '&source=LibrarySearchPluginPublic'; //you can modofy &source to anything you like. This is useful to see how many users are coming to your catalogue via the plugin, in Google Analytics.
            // Create the new tab
            chrome.tabs.create({
                url: newLibraryURL
            });
        }
        //Google Scholar
        if (
            $('#scholar').is(":checked")) {
            //alert("Google Scholar checked");
            var newScholarURL = 'https://scholar.google.com/scholar?q=' + searchstring;
            // Create the new tab
            chrome.tabs.create({
                url: newScholarURL
            });
        }
        //Pubmed
        if (
            $('#pubmed').is(":checked")) {
            //alert("Google Scholar checked");
            var newPubmedURL = 'https://www.ncbi.nlm.nih.gov/pubmed/?term=' + searchstring; // if you use EzProxy, modify the URL here. You may also remove the EzProxy prefix compeltely.
            // Create the new tab
            chrome.tabs.create({
                url: newPubmedURL
            });
        }
    });
    $('#searchInput').keypress(function (e) {
        if (e.which == 13) { //Enter key pressed
            $('#btnOpenNewTab').click(); //Trigger search button click event
        }
    });
});
//CONTEXT STUFF
//Search definitions. %s is the variable that gets replaced by the search term.
var searches = [
    {
        title: "Search in Library Search", // Same as above: edit to match your library's url. Modify &soruce as well at the end. Remeber to keep '%s'
        url: "https://apac-tc.hosted.exlibrisgroup.com/primo-explore/search?vid=BOND&tab=default_tab&search_scope=all_resources&lang=en_US&offset=0&query=any,contains,%s&source=LibrarySearchPluginPublic"
  },
    {
        title: "Search in Google Scholar",
        url: "https://scholar.google.com/scholar?q=%s"
  },
    {
        title: "Search in PubMed", // Again: remove or adapt your ezproxy URL
        url: "https://www.ncbi.nlm.nih.gov/pubmed/?term=%s"
  }
];
// Create a parent item and two children.
var parent = chrome.contextMenus.create({
    "title": "Search with Library Search Plugin", // Change the name here too!
    "id": "0",
    "contexts": ["selection"]
});
searches.forEach(function (obj) {
    console.log("creating context menu item: " + JSON.stringify(obj));
    var contextMenuId = chrome.contextMenus.create({
        "title": obj.title,
        "parentId": parent,
        "contexts": ["selection"],
        "id": (searches.indexOf(obj) + 1).toString()
    });
});
// replace %s with highlighted text
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    console.log(info.menuItemId);
    var searchObj = searches[info.menuItemId - 1];
    if (typeof searchObj === "undefined")
        return;
    chrome.tabs.create({
        "url": searchObj.url.replace("%s", encodeURIComponent(info.selectionText))
    });
});
