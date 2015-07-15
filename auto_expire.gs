// Automatically expire emails in your inbox. Each day, any email with a label
// beginning with "x" has its label updated to take one step closer to "x0"
// ("x4" becomes "x3", etc.). An email with label "x0" is archived.
//
// INSTALLATION:
//
// 1. Create a new spreadsheet in Google Drive.
//    Go to Tools -> Script Editor, and paste this file in.
// 2. Set MAX_DAYS at the top of the script to the highest number label you
//    want to create.
// 3. Run the setup() function to create the labels.
//    (Optional) Go to Gmail and customize the colors of those labels.
// 4. In the script editor, go to Resources -> Current project's triggers.
//    Set the stepExpiration function to run once a day, at the end of the day.
// 5. Create Gmail filters to automatically assign a label like x4 or x2
//    (depending on how fast of an expiration you want) to emails with
//    certain senders or subjects.
// 6. Profit!

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
    }
  }
}

