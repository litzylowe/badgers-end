# Threads — backend setup (Google Sheet + Apps Script)

The **Threads** tab is a shared session log. The site is static, so a small Google
Apps Script "web app" backs it: the site POSTs new threads to it (append a row) and
GETs the list to display. You set this up **once**; the DMs only ever use the in-app form.

## 1. Create the Sheet

1. Make a new Google Sheet.
2. Rename the first tab to **`Threads`** (exact, case-sensitive).
3. In **row 1**, add these headers, one per column (A–F):

   | timestamp | session | date | dm | title | summary |
   |-----------|---------|------|----|-------|---------|

## 2. Add the Apps Script

In the Sheet: **Extensions ▸ Apps Script**. Delete the sample code, paste this,
and change `PASSPHRASE` to a shared group code:

```javascript
const SHEET = 'Threads';
const PASSPHRASE = 'CHANGE-ME';   // the code DMs type in the form

function doGet() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
  const rows = sh.getDataRange().getValues();
  rows.shift(); // drop header
  const data = rows.map(r => ({
    timestamp: r[0], session: r[1], date: r[2], dm: r[3], title: r[4], summary: r[5]
  }));
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const b = JSON.parse(e.postData.contents);
  if (b.passphrase !== PASSPHRASE) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'bad passphrase' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
  sh.appendRow([new Date(), b.session, b.date, b.dm, b.title, b.summary]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy it

1. **Deploy ▸ New deployment**.
2. Type: **Web app**.
3. **Execute as: Me** · **Who has access: Anyone**  ← both matter (Anyone = the site can reach it; Me = it writes to your Sheet with no exposed keys).
4. **Deploy**, authorize when prompted.
5. Copy the **Web app URL** — it ends in `/exec`.

## 4. Connect the site

Send me the `/exec` URL. I paste it into one line in `app.js`:

```js
const THREADS_ENDPOINT = 'https://script.google.com/macros/s/…/exec';
```

…commit, push, and the Threads log is live. Give the DMs the group passphrase and they can post.

## Notes

- **Passphrase** is a soft spam gate, not real security — it just stops random posts. DMs type it once; the site remembers it in their browser.
- **Moderation/edits:** everything is rows in your Sheet — edit or delete a thread by editing the row.
- **If saving fails:** almost always the deployment access isn't set to **Anyone**, or the tab isn't named exactly `Threads`. Re-deploy after fixing.
