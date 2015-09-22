// Add a label to old email threads in your inbox indicating how many days old
// they are.
//
// 1. Set MIN_AGE_TO_APPEND_LABEL and LABEL_PREFIX at the top of the script.
//    If LABEL_PREFIX is 'd', threads will get labels like 'd21'. This script
//    will also *remove* labels that look like (LABEL_PREFIX + a number) when
//    they no longer apply to a message, so choose something that isn't used for
//    anything else.
// 2. Test the script by running the appendTooOldLabels function.
// 3. (Optional) Go to Gmail and customize the colors of the relevant labels.
//    You may need to add some labels since the function will create them only
//    when they are needed.
// 4. Set appendTooOldLabels to run daily, just after midnight.

var MIN_AGE_TO_APPEND_LABEL = 21;
var LABEL_PREFIX = 'd';

function appendTooOldLabels() {
  var now = new Date();

  var start = 0;
  var threads;

  removeAllAgeLabels();

  do {
    threads = GmailApp.getInboxThreads(start, PAGE_SIZE);

    threads.forEach(function(thread) {
      age = dateDiffInDays(thread.getLastMessageDate(), now);
      if(age >= MIN_AGE_TO_APPEND_LABEL) {
        addAgeLabel(thread, age);
      }
    });

    start += PAGE_SIZE;
  } while(threads.length > 0);
}

function removeAllAgeLabels() {
  var ageLabelRe = new RegExp(LABEL_PREFIX + '\\d+');
  GmailApp.getUserLabels().forEach(function(label) {
    if(label.getName().match(ageLabelRe)) {
      label.removeFromThreads(label.getThreads());
    }
  });
}

function addAgeLabel(thread, age) {
  var labelName = LABEL_PREFIX + age;
  var label = GmailApp.getUserLabelByName(labelName);
  if(label === null) {
    label = GmailApp.createLabel(labelName);
  }
  label.addToThread(thread);
}

function dateDiffInDays(d1, d2) {
  // compare dates only, ignore time of day
  return Math.round((datetimeToDate(d2) - datetimeToDate(d1)) / (1000 * 60 * 60 * 24));
}

function datetimeToDate(d) {
  return new Date(1990 + d.getYear(), d.getMonth(), d.getDate());
}
