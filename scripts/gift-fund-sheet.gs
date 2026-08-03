/**
 * ===================================================================
 * Gift fund → Google Sheet
 * ===================================================================
 * Paste this whole file into the Apps Script editor attached to your
 * gift fund spreadsheet, then deploy it as a Web App. Step-by-step
 * instructions are in SETUP.md ("5. Wire up the gift fund").
 *
 * This is a SECOND, separate spreadsheet and deployment from the RSVP
 * one — its own script, its own /exec URL, its own secret.
 *
 * Unlike the RSVP script this one also reads and deletes, because the
 * website shows a running total and you need a way to remove a row
 * someone typed in wrong. All three arrive as a POST carrying an
 * `action`, since a web app only gets the one `doPost` entry point.
 * ===================================================================
 */

// Must match GIFT_FUND_SHARED_SECRET in your .env.local and in Vercel.
// Change both sides together, or every request is rejected.
const SHARED_SECRET = 'change-me-to-something-random';

// The tab rows are written to. Created automatically if missing.
const SHEET_NAME = 'Contributions';

// Column order. The header row is written from `label`, and each row is
// filled by reading `key` off the posted JSON.
const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'submittedAt', label: 'Logged' },
  { key: 'itemId', label: 'Toward' },
  { key: 'name', label: 'From' },
  { key: 'amount', label: 'Amount' },
  { key: 'method', label: 'Method' },
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

    switch (data.action) {
      case 'list':
        return json({ ok: true, contributions: listContributions_() });
      case 'add':
        return json(addContribution_(data));
      case 'delete':
        return json(deleteContribution_(data.id));
      default:
        return json({ ok: false, error: 'unknown action: ' + data.action });
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** Visiting the URL in a browser gives you a readable "it's alive" check. */
function doGet() {
  return json({ ok: true, message: 'Gift fund endpoint is running. Post to it.' });
}

function listContributions_() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, COLUMNS.length).getValues();

  return values
    .filter(function (row) { return row[0]; }) // skip blank rows
    .map(function (row) {
      const out = {};
      COLUMNS.forEach(function (column, i) {
        out[column.key] = row[i];
      });
      // Sheets hands back a Date object for the timestamp column; the site
      // expects an ISO string it can sort and format itself.
      if (out.submittedAt instanceof Date) {
        out.submittedAt = out.submittedAt.toISOString();
      } else {
        out.submittedAt = String(out.submittedAt || '');
      }
      out.id = String(out.id);
      out.amount = Number(out.amount) || 0;
      return out;
    });
}

function addContribution_(data) {
  // A lock keeps two people submitting at the same moment from landing on
  // the same row and overwriting each other.
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getSheet_();
    const row = COLUMNS.map(function (column) {
      if (column.key === 'submittedAt') {
        // Store a real Date so the column sorts and formats in your
        // spreadsheet's own timezone rather than as a string.
        return new Date();
      }
      const value = data[column.key];
      return value === undefined || value === null ? '' : value;
    });
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

function deleteContribution_(id) {
  if (!id) return { ok: false, error: 'no id given' };

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return { ok: false, error: 'not found' };

    // Match on the id column rather than a row number: the site generates
    // the id, so deleting one row never shifts anyone else's handle on
    // their own row.
    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === String(id)) {
        sheet.deleteRow(i + 2);
        return { ok: true };
      }
    }
    return { ok: false, error: 'not found' };
  } finally {
    lock.releaseLock();
  }
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
