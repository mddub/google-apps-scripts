// Automatically expire all emails which Gmail places into the "Promotions" tab.
// (credit: @beaugunderson)
//
// This relies on auto_expire.gs. This separate script is necessary because you
// can't create a filter for things that Gmail categorizes into the "Promotions"
// tab, unfortunately.
//
// 1. If you haven't already done so, set up auto_expire.gs.
// 2. Set PROMOTION_DAYS to the number of days that you want the emails to stay
//    in the "Promotions" tab before expiring.
// 3. Set addPromotionsExpiration to run every 15 minutes.

var PROMOTION_DAYS = 7;

function addPromotionsExpiration() {
  var filters = [
    'label:Promotions',
    'in:inbox'
  ];

  for (var i = 0; i <= PROMOTION_DAYS; i++) {
    filters.push('-label:x' + i);
  }

  var threads = GmailApp.search(filters.join(' '));

  GmailApp.getUserLabelByName('x' + PROMOTION_DAYS).addToThreads(threads);
}
