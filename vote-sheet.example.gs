var SHEET_CONFIG = {
  mate: {
    animates: {
      sheetName: "Animates",
      appearancesKey: "vote_appearances_animates"
    },
    costumes: {
      sheetName: "Costumes",
      appearancesKey: "vote_appearances_costumes"
    }
  },
  song: {
    ost: {
      sheetName: "Song Canon",
      appearancesKey: "vote_appearances_songs_ost"
    },
    bonus: {
      sheetName: "Song Non-Canon",
      appearancesKey: "vote_appearances_songs_bonus"
    }
  }
};

var DEFAULT_ENTITY_TYPE = "mate";
var DEFAULT_MODES = {
  mate: "animates",
  song: "ost"
};
var HEADER_ROW = [["Name", "Votes", "Appearances", "Percentage"]];

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "listAsks") {
    return jsonResponse({ ok: true, sheet: "Asks", asks: readAsks_() });
  }
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var payload = parseVotePayload_(e);

  if (payload.action === "exportAsks") {
    return exportAsks_((e && e.parameter && e.parameter.token) || "");
  }

  if (payload.action === "ask") {
    return saveAsk_(payload);
  }

  if (payload.action === "historyResponse") {
    return saveHistoryResponse_(payload);
  }

  if (payload.action === "reset") {
    resetAllVoteData_();
    return jsonResponse({ ok: true, reset: true });
  }

  if (payload.action !== "vote" || !payload.winner || !payload.winner.name || !payload.loser || !payload.loser.name) {
    return jsonResponse({ ok: false, error: "Invalid payload." });
  }

  var config = getSheetConfig_(payload.entityType, payload.mode);
  var sheet = getOrCreateVoteSheet_(config.sheetName);
  var properties = PropertiesService.getScriptProperties();
  var appearances = JSON.parse(properties.getProperty(config.appearancesKey) || "{}");
  var rows = readVoteRows_(sheet);

  updateRow_(rows, payload.winner.name, true, appearances);
  updateRow_(rows, payload.loser.name, false, appearances);

  writeVoteRows_(sheet, rows);
  properties.setProperty(config.appearancesKey, JSON.stringify(appearances));

  return jsonResponse({ ok: true, entityType: payload.entityType, mode: payload.mode, sheet: config.sheetName });
}

function saveHistoryResponse_(payload) {
  var answer = String(payload.answer || "").trim();
  if (!answer) {
    return jsonResponse({ ok: false, error: "Missing answer." });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("History Responses");
    if (!sheet) {
      sheet = spreadsheet.insertSheet("History Responses");
      sheet.appendRow(["Timestamp", "Question", "Answer"]);
    }

    // Treat user text as literal text, including answers beginning with '='.
    var row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1).setValue(new Date());
    sheet.getRange(row, 2, 1, 2).setNumberFormat("@").setValues([
      ["What is a star?", /^[=+\-@]/.test(answer) ? "'" + answer : answer]
    ]);
    return jsonResponse({ ok: true, sheet: "History Responses" });
  } finally {
    lock.releaseLock();
  }
}

function saveAsk_(payload) {
  var characters = ["Skip", "Chip", "Dip", "Pip", "Zip", "Herc", "Marvin", "Mom", "Dad", "Lumberjack", "Hippie", "Mysterious Trader", "Kal"];
  var times = ["Pre-Update 1", "Post-Update 1"];
  if (characters.indexOf(payload.character) === -1 || times.indexOf(payload.time) === -1
    || typeof payload.question !== "string" || !payload.question.trim() || payload.question.length > 4000
    || typeof payload.name !== "string" || payload.name.length > 80) {
    return jsonResponse({ ok: false, error: "Invalid ask." });
  }
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("Asks");
    if (!sheet) {
      sheet = spreadsheet.insertSheet("Asks");
      sheet.appendRow(["ID", "Timestamp", "Character", "Time", "Name", "Question"]);
    }
    var id = Utilities.getUuid();
    var date = new Date().toISOString();
    var values = [id, date, payload.character, payload.time, payload.name.trim(), payload.question];
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, 6).setNumberFormat("@").setValues([
      values.map(function(value) { return /^[=+\-@]/.test(value) ? "'" + value : value; })
    ]);
    SpreadsheetApp.flush();
    return jsonResponse({ ok: true, sheet: "Asks", id: id });
  } finally {
    lock.releaseLock();
  }
}

// Run from the bound spreadsheet, not the public web app.
function onOpen() {
  SpreadsheetApp.getUi().createMenu("Asks").addItem("Download asks for website", "downloadAsks").addToUi();
}

function readAsks_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Asks");
  var rows = sheet && sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues() : [];
  return rows.filter(function(row) { return row[0]; }).map(function(row) {
    return { id: String(row[0]), date: new Date(row[1]).toISOString(), character: String(row[2]), time: String(row[3]), name: String(row[4]), question: String(row[5]) };
  });
}

function exportAsks_(token) {
  var expected = PropertiesService.getScriptProperties().getProperty("ASK_SYNC_TOKEN");
  if (!expected || !token || token !== expected) {
    return jsonResponse({ ok: false, error: "Unauthorized." });
  }
  return jsonResponse({ ok: true, sheet: "Asks", asks: readAsks_() });
}

function downloadAsks() {
  var asks = readAsks_();
  var encoded = Utilities.base64Encode(JSON.stringify(asks, null, 2), Utilities.Charset.UTF_8);
  var html = HtmlService.createHtmlOutput('<p><a download="ask-inbox.json" href="data:application/json;base64,' + encoded + '">Download ask-inbox.json</a></p>');
  SpreadsheetApp.getUi().showModalDialog(html, "Download asks");
}

function getSheetConfig_(entityType, mode) {
  var entityConfig = SHEET_CONFIG[entityType] || SHEET_CONFIG[DEFAULT_ENTITY_TYPE];
  var defaultMode = DEFAULT_MODES[entityType] || DEFAULT_MODES[DEFAULT_ENTITY_TYPE];
  return entityConfig[mode] || entityConfig[defaultMode] || entityConfig[Object.keys(entityConfig)[0]];
}

function getOrCreateVoteSheet_(sheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  ensureHeaderRow_(sheet);

  return sheet;
}

function ensureHeaderRow_(sheet) {
  var headerRange = sheet.getRange(1, 1, 1, 4);
  var currentHeader = headerRange.getValues();
  if (JSON.stringify(currentHeader) !== JSON.stringify(HEADER_ROW)) {
    headerRange.setValues(HEADER_ROW);
  }
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
      var aPct = parseFloat(String(a.percentage).replace("%", "")) || 0;
      var bPct = parseFloat(String(b.percentage).replace("%", "")) || 0;
      if (bPct !== aPct) {
        return bPct - aPct;
      }

      if (b.votes !== a.votes) {
        return b.votes - a.votes;
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
  Object.keys(SHEET_CONFIG).forEach(function(entityType) {
    Object.keys(SHEET_CONFIG[entityType]).forEach(function(mode) {
      var config = SHEET_CONFIG[entityType][mode];
      var sheet = getOrCreateVoteSheet_(config.sheetName);
      resetVoteData_(sheet);
      PropertiesService.getScriptProperties().deleteProperty(config.appearancesKey);
    });
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

  ensureHeaderRow_(sheet);
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
    answer: params.answer || "",
    character: params.character || "",
    time: params.time || "",
    name: params.name || "",
    question: params.question || "",
    entityType: params.entityType || "",
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
  var entityType = SHEET_CONFIG[payload.entityType] ? payload.entityType : DEFAULT_ENTITY_TYPE;
  var entityConfig = SHEET_CONFIG[entityType];
  var defaultMode = DEFAULT_MODES[entityType] || DEFAULT_MODES[DEFAULT_ENTITY_TYPE];

  return {
    action: payload.action || "",
    answer: payload.answer || "",
    character: payload.character || "",
    time: payload.time || "",
    name: payload.name || "",
    question: payload.question || "",
    entityType: entityType,
    mode: entityConfig[payload.mode] ? payload.mode : defaultMode,
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
