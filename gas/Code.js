// ============================================================
// Bosu Web App - Cloud Backend (Google Apps Script)
// Syncs apps across multiple devices using Google Drive & Google Sheets
// Automatically creates folder 'Bosu' and spreadsheet 'Bosu_Database'
// ============================================================

const DEFAULT_APPS = [
  {
    id: 'wntk-library-system',
    name: 'WNTK Library System',
    url: 'https://bosu-nsoq.github.io/wntk-library-system/',
    icon: 'https://i.postimg.cc/D0Dw84J1/WNTK.png',
    active: true
  },
  {
    id: 'financial',
    name: 'Financial',
    url: 'https://bosu-nsoq.github.io/financial/',
    icon: 'https://i.postimg.cc/T2Cngdnd/Financial.png',
    active: true
  },
  {
    id: 'lunar',
    name: 'Lunar',
    url: 'https://bosu-nsoq.github.io/lunar/',
    icon: 'https://i.postimg.cc/xC1sKNwZ/Lunar.png',
    active: true
  }
];

// 1. Get or Create 'Bosu' Folder in Google Drive
function getOrCreateBosuFolder() {
  const folders = DriveApp.getFoldersByName("Bosu");
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder("Bosu");
}

// 2. Get or Create Spreadsheet inside 'Bosu' Folder
function getOrCreateDatabaseSpreadsheet() {
  const folder = getOrCreateBosuFolder();
  const files = folder.getFilesByName("Bosu_Database");
  let ss;
  
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    // Create new spreadsheet and place directly inside Bosu folder
    ss = SpreadsheetApp.create("Bosu_Database");
    const file = DriveApp.getFileById(ss.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);
  }

  let sheet = ss.getSheetByName("Apps");
  if (!sheet) {
    sheet = ss.getActiveSheet();
    sheet.setName("Apps");
    sheet.clear();
    
    // Header + Default Apps in single setValues call
    const initialRows = [
      ["id", "name", "url", "icon", "active", "order", "updated_at"],
      ...DEFAULT_APPS.map((app, idx) => [
        app.id,
        app.name,
        app.url,
        app.icon,
        app.active,
        idx + 1,
        new Date().toISOString()
      ])
    ];
    sheet.getRange(1, 1, initialRows.length, 7).setValues(initialRows);
  }

  return ss;
}

// One-time Setup & Authorization Helper (คลิกเลือกฟังก์ชันนี้แล้วกด "เรียกใช้" เพื่ออนุมัติสิทธิ์ครั้งแรก)
function initBosuDatabase() {
  const folder = getOrCreateBosuFolder();
  const ss = getOrCreateDatabaseSpreadsheet();
  const apps = getAppsFromSheet();
  Logger.log("✅ สร้าง/ตรวจสอบโฟลเดอร์ Bosu ใน Drive สำเร็จ: " + folder.getUrl());
  Logger.log("✅ สร้าง/ตรวจสอบสเปรดชีต Bosu_Database สำเร็จ: " + ss.getUrl());
  Logger.log("✅ โหลดแอปตั้งต้นสำเร็จ ทั้งหมด " + apps.length + " แอป");
  return {
    folderUrl: folder.getUrl(),
    sheetUrl: ss.getUrl(),
    appsCount: apps.length
  };
}

// 3. Read All Apps from Sheet (Lock protected)
function getAppsFromSheet() {
  const lock = LockService.getScriptLock();
  let hasLock = false;
  try {
    // Wait up to 10 seconds for any ongoing write operation to finish completely
    hasLock = lock.tryLock(10000);
    const ss = getOrCreateDatabaseSpreadsheet();
    const sheet = ss.getSheetByName("Apps");
    if (!sheet) return DEFAULT_APPS;

    const data = sheet.getDataRange().getValues();
    if (!data || data.length <= 1) {
      // If table has only header or is empty
      return DEFAULT_APPS;
    }

    const headers = data[0].map(h => String(h).toLowerCase().trim());
    const idIdx = headers.indexOf("id");
    const nameIdx = headers.indexOf("name");
    const urlIdx = headers.indexOf("url");
    const iconIdx = headers.indexOf("icon");
    const activeIdx = headers.indexOf("active");
    const orderIdx = headers.indexOf("order");

    const apps = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || (!row[idIdx] && !row[urlIdx])) continue;
      
      apps.push({
        id: String(row[idIdx] || ('app-' + i)),
        name: String(row[nameIdx] || ''),
        url: String(row[urlIdx] || ''),
        icon: String(row[iconIdx] || ''),
        active: row[activeIdx] === true || String(row[activeIdx]).toLowerCase() === 'true',
        order: Number(row[orderIdx]) || i
      });
    }

    apps.sort((a, b) => a.order - b.order);
    return apps.length > 0 ? apps : DEFAULT_APPS;
  } catch (err) {
    Logger.log("getAppsFromSheet error: " + err);
    return DEFAULT_APPS;
  } finally {
    if (hasLock) {
      try { lock.releaseLock(); } catch (e) {}
    }
  }
}

// 4. Save/Sync Apps to Sheet (Atomic & Lock protected)
function saveAppsToSheet(apps) {
  if (!Array.isArray(apps) || apps.length === 0) {
    return { success: false, error: "Invalid or empty apps list" };
  }
  
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const ss = getOrCreateDatabaseSpreadsheet();
    const sheet = ss.getSheetByName("Apps") || ss.getActiveSheet();
    
    const existingLastRow = sheet.getLastRow();

    // Prepare full matrix with header
    const rows = [
      ["id", "name", "url", "icon", "active", "order", "updated_at"],
      ...apps.map((app, idx) => [
        app.id || ('app-' + (idx + 1)),
        app.name || '',
        app.url || '',
        app.icon || '',
        app.active !== false,
        idx + 1,
        new Date().toISOString()
      ])
    ];

    // ATOMIC WRITE: Overwrite existing range directly without clearContents()
    sheet.getRange(1, 1, rows.length, 7).setValues(rows);

    // If previously there were more rows, clear excess rows below
    if (existingLastRow > rows.length) {
      sheet.getRange(rows.length + 1, 1, existingLastRow - rows.length, sheet.getLastColumn() || 7).clearContent();
    }

    SpreadsheetApp.flush();
    return { success: true, count: apps.length };
  } catch (e) {
    return { success: false, error: e.toString() };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

// 5. HTTP GET Handler (Read apps)
function doGet(e) {
  const apps = getAppsFromSheet();
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    data: apps,
    timestamp: Date.now()
  })).setMimeType(ContentService.MimeType.JSON);
}

// 6. HTTP POST Handler (Sync/Update apps)
function doPost(e) {
  try {
    let body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    const action = body.action || (e && e.parameter && e.parameter.action);

    if (action === "saveApps") {
      const result = saveAppsToSheet(body.apps || []);
      if (!result.success) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: result.error || "Save failed"
        })).setMimeType(ContentService.MimeType.JSON);
      }

      const updatedApps = getAppsFromSheet();
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Saved successfully",
        data: updatedApps,
        timestamp: Date.now()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Default action: getApps
    const apps = getAppsFromSheet();
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      data: apps,
      timestamp: Date.now()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
