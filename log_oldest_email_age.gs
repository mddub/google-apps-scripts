// Log the age of the oldest message thread in your inbox (only if it has
// changed since the last time it was logged).
//
// 1. Create a new spreadsheet or add a new sheet to an existing spreadsheet
//    where you want to log the data.
// 2. Add column headings, "Date" and "Oldest Email", to the first row of that
//    sheet.
// 3. Set SPREADSHEET_URL and SHEET_NAME to that spreadsheet and sheet.
// 4  Set logOldestEmailAge to run every 5 minutes.
// 5. (Optional) Use Zapier to send this data to a Beeminder "do less" goal to
//    force yourself to deal with emails before they get too old.

var SPREADSHEET_URL = 'put your google spreadsheet url here (ends in /edit)';
var SHEET_NAME = 'put the name of the sheet here (e.g. Sheet1)';

var PAGE_SIZE = 50;

function logOldestEmailAge() {
  var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = ss.getSheetByName(SHEET_NAME);

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

  var ageOfOldest = dateDiffInDays(oldest, now);
  var lastValueLogged = sheet.getRange(sheet.getLastRow(), 2).getValue();

  if(ageOfOldest !== lastValueLogged) {

    // if the sheet is full, add a new batch of rows
    if(sheet.getLastRow() === sheet.getMaxRows()) {
      sheet.insertRowsAfter(sheet.getMaxRows(), 100);
    }

    sheet.getRange(sheet.getLastRow() + 1, 1, 1, 2).setValues(
      [[now, ageOfOldest]]
    );

  }
}

function dateDiffInDays(d1, d2) {
  // compare dates only, ignore time of day
  return Math.round((datetimeToDate(d2) - datetimeToDate(d1)) / (1000 * 60 * 60 * 24));
}

function datetimeToDate(d) {
  return new Date(1990 + d.getYear(), d.getMonth(), d.getDate());
}
