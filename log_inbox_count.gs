// Log the number of threads in your inbox.
//
// INSTALLATION:
//
// 1. Create a new spreadsheet in Google Drive.
//    Go to Tools -> Script Editor, and paste this file in.
// 2. At the top, set SPREADSHEET_URL and SHEET_NAME to the spreadsheet where
//    you want to log your inbox count (this is probably the blank new sheet you
//    just created).
// 3. Add column headings, "Date" and "Count", to the first row of the sheet you
//    specified in step 2.
// 4. In the script editor, go to Resources -> Current project's triggers.
//    Set the logInboxCount function to run hourly or daily, depending on how
//    often you want to gather this data.
// 5. Profit! (create a graph in a new sheet and share it publicly, etc.)

var SPREADSHEET_URL = 'put your google spreadsheet url here';
var SHEET_NAME = 'put the name of the sheet here (e.g. Sheet1)';

var PAGE_SIZE = 50;

function logInboxCount() {
  var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = ss.getSheetByName(SHEET_NAME);

  var count = 0;
  var start = 0;
  var threads;

  do {
    threads = GmailApp.getInboxThreads(start, PAGE_SIZE);
    count += threads.length;

    start += PAGE_SIZE;
  } while(threads.length > 0);

  // if the sheet is full, add a new batch of rows
  if(sheet.getLastRow() == sheet.getMaxRows()) {
    sheet.insertRowsAfter(sheet.getMaxRows(), 100);
  }

  sheet.getRange(sheet.getLastRow() + 1, 1, 1, 2).setValues([[new Date(), count]]);
}
