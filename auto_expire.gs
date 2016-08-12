// Automatically expire emails in your inbox. Each day, any email with a label
// beginning with "x" has its label updated to take one step closer to "x0"
// ("x4" becomes "x3", etc.). An email with label "x0" is archived.
//
// 1. Set MAX_DAYS at the top of the script to the highest number label you
//    want to create.
// 2. Run the setup() function to create the labels.
//    (Optional) Go to Gmail and customize the colors of those labels.
// 3. Set the stepExpiration function to run once a day, at the end of the day.
// 4. Create Gmail filters to automatically assign a label like x4 or x2
//    (depending on how fast of an expiration you want) to emails with
//    certain senders or subjects.

var MAX_DAYS = 6;

function setup() {
  for(var i = 0; i <= MAX_DAYS; i++) {
    GmailApp.createLabel("x" + i);
  }
}

function stepExpiration() {
  var threads;

  for(var i = 0; i <= MAX_DAYS; i++) {
    threads = null;

    while(!threads || threads.length == 100) {
      threads = GmailApp.getUserLabelByName("x" + i).getThreads(0, 100);

      if(threads.length > 0) {
        GmailApp.getUserLabelByName("x" + i).removeFromThreads(threads);

        if(i == 0) {
          GmailApp.moveThreadsToArchive(threads);
        } else {
          GmailApp.getUserLabelByName("x" + (i - 1)).addToThreads(threads);
        }
      }

      Utilities.sleep(1000);
    }
  }
}
