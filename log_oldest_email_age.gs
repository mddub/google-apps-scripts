// Log the age of the oldest message thread in your inbox (only if it has
// changed since the last time it was logged).
//
// INSTALLATION:
//
// 1. Create a new spreadsheet in Google Drive.
//    Go to Tools -> Script Editor, create a script for a "Blank Project".
//    Paste this file in.
// 2. At the top, set SPREADSHEET_URL and SHEET_NAME to the spreadsheet where
//    you want to log the data (this is probably the blank new sheet you just
//    created).
// 3. Add column headings, "Date" and "Oldest Email", to the first row of the
//    sheet you specified in step 2.
// 4. In the script editor, go to Resources -> Current project's triggers.
//    Set the logOldestEmailAge function to run hourly or daily, depending on how
//    often you want to gather this data.
// 5. Profit! (hook it up to Zapier + Beeminder, etc.)

var SPREADSHEET_URL = 'put your google spreadsheet url here (ends in /edit)';
var SHEET_NAME = 'put the name of the sheet here (e.g. Sheet1)';

var PAGE_SIZE = 50;

function logOldestEmailAge() {
  var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = ss.getSheetByName(DETAILS_SHEET_NAME);

  var now = new Date();
  var oldest = now;

  var start = 0;
  var threads;

  do {
    threads = GmailApp.getInboxThreads(start, PAGE_SIZE);

    threads.forEach(function(thread) {
      oldest = thread.getLastMessageDate() < oldest ? thread.getLastMessageDate() : oldest;
    });

    start += PAGE_SIZE;
  } while(threads.length > 0);

  var ageOfOldestInDays = Math.floor((now - oldest) / (1000 * 60 * 60 * 24));
  var lastValueLogged = sheet.getRange(sheet.getLastRow(), 2).getValue();

  if(ageOfOldestInDays !== lastValueLogged) {

    // if the sheet is full, add a new batch of rows
    if(sheet.getLastRow() === sheet.getMaxRows()) {
      sheet.insertRowsAfter(sheet.getMaxRows(), 100);
    }

    sheet.getRange(sheet.getLastRow() + 1, 1, 1, 2).setValues(
      [[now, ageOfOldestInDays]]
    );

  }
}
