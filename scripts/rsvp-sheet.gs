/**
 * ===================================================================
 * RSVP → Google Sheet
 * ===================================================================
 * Paste this whole file into the Apps Script editor attached to your
 * RSVP spreadsheet, then deploy it as a Web App. Step-by-step
 * instructions are in SETUP.md ("3. Wire up the RSVP sheet").
 *
 * What it does: accepts a POST from the website's RSVP form and appends
 * one row per response, creating the header row the first time it runs.
 * ===================================================================
 */

// Must match RSVP_SHARED_SECRET in your .env.local and in Vercel.
// It's not real security — it just stops a stray bot that finds the URL
// from filling your sheet with junk. Change both sides together.
const SHARED_SECRET = 'test';

// The tab the rows are written to. Created automatically if missing.
const SHEET_NAME = 'test';

// Column order. The first row of the sheet is written from `label`, and
// each row is filled by reading `key` off the posted JSON.
const COLUMNS = [
  { key: 'submittedAt', label: 'Submitted' },
  { key: 'attending', label: 'Attending?' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'partySize', label: 'Party Size' },
  { key: 'kidsCount', label: 'Kids' },
  { key: 'guestNames', label: 'Who Is Coming' },
  { key: 'dietary', label: 'Allergies / Dietary' },
  { key: 'note', label: 'Note' },
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'empty request' });
    }

    const data = JSON.parse(e.postData.contents);

    if (SHARED_SECRET && data.secret !== SHARED_SECRET) {
      return json({ ok: false, error: 'bad secret' });
    }

    // The site sends a UTC timestamp string; replacing it with a real Date
    // makes Sheets store it as an actual date/time in your spreadsheet's
    // own timezone, so it sorts and formats properly.
    data.submittedAt = new Date();

    // A lock keeps two RSVPs submitted at the same moment from landing on
    // the same row and overwriting each other.
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const sheet = getSheet_();
      sheet.appendRow(COLUMNS.map(function (c) { return data[c.key] || ''; }));
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** Visiting the URL in a browser gives you a readable "it's alive" check. */
function doGet() {
  return json({ ok: true, message: 'RSVP endpoint is running. Post to it.' });
}

function getSheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    const labels = COLUMNS.map(function (c) { return c.label; });
    sheet.appendRow(labels);
    sheet.getRange(1, 1, 1, labels.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
