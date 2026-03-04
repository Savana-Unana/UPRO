var SHEET_CONFIG = {
  finalized: {
    sheetName: "Finalized",
    appearancesKey: "vote_appearances_finalized"
  },
  conceptualized: {
    sheetName: "Conceptualized",
    appearancesKey: "vote_appearances_conceptualized"
  },
  all: {
    sheetName: "All Mons",
    appearancesKey: "vote_appearances_all"
  }
};

var DEFAULT_MODE = "all";
var HEADER_ROW = [["Name", "Votes", "Appearances", "Percentage"]];

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var payload = parseVotePayload_(e);

  if (payload.action === "reset") {
    resetAllVoteData_();
    return jsonResponse({ ok: true, reset: true });
  }

  if (payload.action !== "vote" || !payload.winner || !payload.winner.name || !payload.loser || !payload.loser.name) {
    return jsonResponse({ ok: false, error: "Invalid payload." });
  }

  var config = getSheetConfig_(payload.mode);
  var sheet = getOrCreateVoteSheet_(config.sheetName);
  var properties = PropertiesService.getScriptProperties();
  var appearances = JSON.parse(properties.getProperty(config.appearancesKey) || "{}");
  var rows = readVoteRows_(sheet);

  updateRow_(rows, payload.winner.name, true, appearances);
  updateRow_(rows, payload.loser.name, false, appearances);

  writeVoteRows_(sheet, rows);
  properties.setProperty(config.appearancesKey, JSON.stringify(appearances));

  return jsonResponse({ ok: true, mode: payload.mode, sheet: config.sheetName });
}

function getSheetConfig_(mode) {
  return SHEET_CONFIG[mode] || SHEET_CONFIG[DEFAULT_MODE];
}

function getOrCreateVoteSheet_(sheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 4).setValues(HEADER_ROW);
  }

  return sheet;
}

function readVoteRows_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return {};
  }

  var values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  var rows = {};
  values.forEach(function(row, index) {
    var name = row[0];
    if (!name) {
      return;
    }

    rows[name] = {
      rowNumber: index + 2,
      votes: Number(row[1]) || 0,
      appearances: Number(row[2]) || 0,
      percentage: row[3] || "0.00%"
    };
  });
  return rows;
}

function updateRow_(rows, name, won, appearances) {
  if (!rows[name]) {
    rows[name] = {
      rowNumber: null,
      votes: 0,
      appearances: 0,
      percentage: "0.00%"
    };
  }

  if (!appearances[name]) {
    appearances[name] = 0;
  }

  appearances[name] += 1;
  rows[name].appearances = appearances[name];

  if (won) {
    rows[name].votes += 1;
  }

  var likedPct = appearances[name] ? (rows[name].votes / appearances[name]) * 100 : 0;
  rows[name].percentage = likedPct.toFixed(2) + "%";
}

function writeVoteRows_(sheet, rows) {
  var sortedRows = Object.keys(rows)
    .map(function(name) {
      return {
        name: name,
        votes: rows[name].votes,
        appearances: rows[name].appearances,
        percentage: rows[name].percentage
      };
    })
    .sort(function(a, b) {
      if (b.votes !== a.votes) {
        return b.votes - a.votes;
      }

      var aPct = parseFloat(String(a.percentage).replace("%", "")) || 0;
      var bPct = parseFloat(String(b.percentage).replace("%", "")) || 0;
      if (bPct !== aPct) {
        return bPct - aPct;
      }

      return a.name.localeCompare(b.name);
    });

  var values = sortedRows.map(function(row) {
    return [row.name, row.votes, row.appearances, row.percentage];
  });

  var neededRows = values.length + 1;
  if (sheet.getMaxRows() < neededRows) {
    sheet.insertRowsAfter(sheet.getMaxRows(), neededRows - sheet.getMaxRows());
  }

  if (values.length) {
    sheet.getRange(2, 1, values.length, 4).setValues(values);
  }

  var existingContentRows = sheet.getLastRow() - 1;
  if (existingContentRows > values.length) {
    sheet.getRange(values.length + 2, 1, existingContentRows - values.length, 4).clearContent();
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function resetAllVoteData_() {
  Object.keys(SHEET_CONFIG).forEach(function(mode) {
    var config = SHEET_CONFIG[mode];
    var sheet = getOrCreateVoteSheet_(config.sheetName);
    resetVoteData_(sheet);
    PropertiesService.getScriptProperties().deleteProperty(config.appearancesKey);
  });
}

function resetVoteData_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 4).clearContent();
  }

  var maxRows = sheet.getMaxRows();
  if (maxRows > 2) {
    sheet.deleteRows(2, maxRows - 2);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 4).setValues(HEADER_ROW);
  }
}

function parseVotePayload_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      var parsed = JSON.parse(e.postData.contents);
      if (parsed && typeof parsed === "object") {
        return normalizeVotePayload_(parsed);
      }
    } catch (error) {}
  }

  var params = (e && e.parameter) || {};
  return normalizeVotePayload_({
    action: params.action || "",
    mode: params.mode || "",
    winner: {
      name: params.winnerName || "",
      source: params.winnerSource || ""
    },
    loser: {
      name: params.loserName || "",
      source: params.loserSource || ""
    }
  });
}

function normalizeVotePayload_(payload) {
  return {
    action: payload.action || "",
    mode: SHEET_CONFIG[payload.mode] ? payload.mode : DEFAULT_MODE,
    winner: {
      name: payload.winner && payload.winner.name || payload.winnerName || "",
      source: payload.winner && payload.winner.source || payload.winnerSource || ""
    },
    loser: {
      name: payload.loser && payload.loser.name || payload.loserName || "",
      source: payload.loser && payload.loser.source || payload.loserSource || ""
    }
  };
}
