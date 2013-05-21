function waitFor(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000;
  var start = new Date().getTime();
  var condition = false;
  var interval = setInterval(function() {
    if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
      // If not time-out yet and condition not yet fulfilled
      condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
    } else {
      if(!condition) {
        // If condition still not fulfilled (timeout but condition is 'false')
        console.log("'waitFor()' timeout");
        phantom.exit(1);
      } else {
        // Condition fulfilled (timeout and/or condition is 'true')
        console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
        typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
        clearInterval(interval); //< Stop this interval
      }
    }
  }, 250); //< repeat check every 250ms
};

var page = require('webpage').create();

page.open('http://www.recreation.gov/unifSearchResults.do?topTabIndex=Search', function() {
  var input_val = page.evaluate(function() {
    jQuery("#locationCriteria").val("YOSEMITE NATIONAL PARK");
    jQuery("#locationPosition").val("NRSO:2991:-119.583889:37.744722:");
    jQuery("#interest").val("camping");
    jQuery("#interest").trigger("change");
    jQuery("#campingDate").val("Fri Jun 07 2013");
    jQuery("#lengthOfStay").val("2");
    jQuery("#unifSearchForm button[type=submit]").click();
  });

  setTimeout(function() {
    var available_sites = page.evaluate(function() {
      return jQuery(".check_avail_panel .book_now").length;
    });

    console.log("Found " + available_sites + " sites available");
    
    page.render('filled_in.png');
    phantom.exit();
  }, 3000);
});