function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Votes");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Votes");
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 3).setValues([["Name", "Votes", "Percentage"]]);
  }

  var payload = JSON.parse(e.postData.contents || "{}");
  if (payload.action !== "vote" || !payload.winner || !payload.loser) {
    return jsonResponse({ ok: false, error: "Invalid payload." });
  }

  var properties = PropertiesService.getScriptProperties();
  var appearances = JSON.parse(properties.getProperty("vote_appearances") || "{}");
  var rows = readVoteRows_(sheet);

  updateRow_(rows, payload.winner.name, true, appearances);
  updateRow_(rows, payload.loser.name, false, appearances);

  writeVoteRows_(sheet, rows);
  properties.setProperty("vote_appearances", JSON.stringify(appearances));

  return jsonResponse({ ok: true });
}

function readVoteRows_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return {};
  }

  var values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  var rows = {};
  values.forEach(function(row, index) {
    var name = row[0];
    if (!name) {
      return;
    }

    rows[name] = {
      rowNumber: index + 2,
      votes: Number(row[1]) || 0,
      percentage: row[2] || "0.00%"
    };
  });
  return rows;
}

function updateRow_(rows, name, won, appearances) {
  if (!rows[name]) {
    rows[name] = {
      rowNumber: null,
      votes: 0,
      percentage: "0.00%"
    };
  }

  if (!appearances[name]) {
    appearances[name] = 0;
  }

  appearances[name] += 1;

  if (won) {
    rows[name].votes += 1;
  }

  var likedPct = appearances[name] ? (rows[name].votes / appearances[name]) * 100 : 0;
  rows[name].percentage = likedPct.toFixed(2) + "%";
}

function writeVoteRows_(sheet, rows) {
  var names = Object.keys(rows).sort();
  var values = names.map(function(name) {
    return [name, rows[name].votes, rows[name].percentage];
  });

  var neededRows = values.length + 1;
  if (sheet.getMaxRows() < neededRows) {
    sheet.insertRowsAfter(sheet.getMaxRows(), neededRows - sheet.getMaxRows());
  }

  if (values.length) {
    sheet.getRange(2, 1, values.length, 3).setValues(values);
  }

  var existingContentRows = sheet.getLastRow() - 1;
  if (existingContentRows > values.length) {
    sheet.getRange(values.length + 2, 1, existingContentRows - values.length, 3).clearContent();
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
