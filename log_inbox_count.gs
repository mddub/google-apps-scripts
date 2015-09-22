// Log the number of threads in your inbox.
//
// 1. Create a new spreadsheet or add a new sheet to an existing spreadsheet
//    where you want to log the data.
// 2. Add column headings, "Date" and "Count", to the first row of that sheet.
// 3. Set SPREADSHEET_URL and SHEET_NAME to that spreadsheet and sheet.
// 4. Set the logInboxCount function to run hourly or daily, depending on how
//    often you want to gather this data.

var SPREADSHEET_URL = 'put your google spreadsheet url here (ends in /edit)';
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
