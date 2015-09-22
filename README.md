# google-apps-scripts

A collection of my Google Apps Script code, primarily for automating Gmail.

* **append_too_old_labels.gs** - add a label to old email threads in your inbox indicating how many days old they are.
* **auto_expire.gs** - automatically expire emails so they don't spend too long in your inbox.
* **log_inbox_count.gs** - log the number of threads in your inbox.
* **log_oldest_email_age.gs** - log the age of the oldest message thread in your inbox.

## Installation

1. Visit https://script.google.com/ and create a script for "Blank Project".
1. Paste the file in.
1. Follow additional instructions at the top of the file, e.g. to set configuration variables.
1. Click the name "Untited project" at the top of the screen and change it to something descriptive of what the script does.
1. In the menu at the top of the screen, go to Resources -> Current project's triggers. This is where you will set your script to run regularly. The instructions at the top of the file should indicate which function and how often.
1. Profit!
