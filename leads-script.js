/**
 * AI Products — Google Apps Script · Lead Capture
 * ─────────────────────────────────────────────────────────────
 * This script receives product enquiries from the website and
 * saves them to a Google Sheet — one row per lead.
 *
 * ── SETUP (do this once, ~3 minutes) ─────────────────────────
 *
 *  1. Go to sheets.google.com → create a new spreadsheet.
 *     Name it "AI Products Leads".
 *
 *  2. Extensions → Apps Script.
 *     Delete the default code and paste this entire file.
 *
 *  3. Click  Deploy → New Deployment
 *       · Type:            Web App
 *       · Execute as:      Me
 *       · Who has access:  Anyone
 *     Click Deploy → Authorise when prompted.
 *
 *  4. Copy the Web App URL  (looks like https://script.google.com/macros/s/…/exec)
 *
 *  5. Add it as a GitHub repository secret named  LEADS_SHEET_URL
 *     (Settings → Secrets and variables → Actions → New repository secret)
 *
 *  That's it. Every product enquiry on the website will appear
 *  as a new row in this sheet with timestamp, product name,
 *  name, phone, email, and message.
 * ─────────────────────────────────────────────────────────────
 */

var SHEET_NAME = 'Leads';

var HEADERS = [
  'Timestamp (IST)',
  'Product',
  'Name',
  'Phone',
  'Email',
  'Message',
];

/* ── GET handler ── (frontend sends data as URL query parameters) */
function doGet(e) {

  /* Health-check: no data params → just confirm the endpoint is live */
  if (!e || !e.parameter || !e.parameter.name) {
    return ContentService.createTextOutput(
      'AI Products leads endpoint is active. Enquiries are saved here.'
    );
  }

  try {
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    /* Create the sheet with headers on first run */
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);

      var hRange = sheet.getRange(1, 1, 1, HEADERS.length);
      hRange.setValues([HEADERS]);
      hRange.setFontWeight('bold');
      hRange.setBackground('#0d0d1a');
      hRange.setFontColor('#ffffff');
      sheet.setFrozenRows(1);

      /* Column widths for readability */
      sheet.setColumnWidth(1, 160); /* Timestamp  */
      sheet.setColumnWidth(2, 220); /* Product    */
      sheet.setColumnWidth(3, 160); /* Name       */
      sheet.setColumnWidth(4, 130); /* Phone      */
      sheet.setColumnWidth(5, 200); /* Email      */
      sheet.setColumnWidth(6, 320); /* Message    */
    }

    var timestamp = Utilities.formatDate(
      new Date(), 'Asia/Kolkata', 'dd-MM-yyyy HH:mm:ss'
    );

    sheet.appendRow([
      timestamp,
      e.parameter.product || '',
      e.parameter.name    || '',
      e.parameter.phone   || '',
      e.parameter.email   || '',
      e.parameter.message || '',
    ]);

    /* Alternate row shading so the sheet is easy to scan */
    var lastRow  = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, HEADERS.length);
    rowRange.setBackground(lastRow % 2 === 0 ? '#0f0f1e' : '#06060f');
    rowRange.setFontColor('#e5e7eb');

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
