// Add a label to old email threads in your inbox indicating how many days old
// they are.
//
// 1. Set MIN_AGE_TO_APPEND_LABEL, LABEL_PREFIX, and DELETE_UNUSED_LABELS at the
//    top of the script.
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

// Set to true if you don't want a label like d8 in your sidebar when there are
// no emails to which it applies. The downside is that you'll lose your label
// preferences (color, show in label list, etc.).
var DELETE_UNUSED_LABELS = false;

var PAGE_SIZE = 50;

function appendTooOldLabels() {
  var now = new Date();

  var start = 0;
  var threads;

  var existingLabels = unlabelMessages();
  var usedLabels = {};

  do {
    threads = GmailApp.getInboxThreads(start, PAGE_SIZE);

    threads.forEach(function(thread) {
      age = dateDiffInDays(thread.getLastMessageDate(), now);
      if(age >= MIN_AGE_TO_APPEND_LABEL) {
        addAgeLabel(thread, age);
        usedLabels[LABEL_PREFIX + age] = true;
      }
    });

    start += PAGE_SIZE;
    Utilities.sleep(1000);
  } while(threads.length > 0);

  if (DELETE_UNUSED_LABELS) {
    removeUnusedAgeLabels(existingLabels, usedLabels);
  }
}

function unlabelMessages() {
  var ageLabelRe = new RegExp('^' + LABEL_PREFIX + '\\d+$');
  var labelNames = [];
  GmailApp.getUserLabels().forEach(function(label) {
    if(label.getName().match(ageLabelRe)) {
      labelNames.push(label.getName());
      label.removeFromThreads(label.getThreads());
      Utilities.sleep(1000);
    }
  });
  return labelNames;
}

function addAgeLabel(thread, age) {
  var labelName = LABEL_PREFIX + age;
  var label = GmailApp.getUserLabelByName(labelName);
  if(label === null) {
    label = GmailApp.createLabel(labelName);
  }
  label.addToThread(thread);
}

function removeUnusedAgeLabels(existing, used) {
  existing.forEach(function(labelName) {
    if (used[labelName] === undefined) {
      GmailApp.getUserLabelByName(labelName).deleteLabel();
    }
  });
}

function dateDiffInDays(d1, d2) {
  // compare dates only, ignore time of day
  return Math.round((datetimeToDate(d2) - datetimeToDate(d1)) / (1000 * 60 * 60 * 24));
}

function datetimeToDate(d) {
  return new Date(1990 + d.getYear(), d.getMonth(), d.getDate());
}
