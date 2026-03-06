const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const PROGRESS_DIR = path.join(__dirname, '..', '..', 'data');
const PROGRESS_FILE = path.join(PROGRESS_DIR, 'progress.json');
const PROGRESS_FOLDER_NAME = 'progress';

/**
 * Load progress from a local JSON file.
 */
function load() {
  if (!fs.existsSync(PROGRESS_FILE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
}

/**
 * Save progress to a local JSON file.
 */
function save(data) {
  if (!fs.existsSync(PROGRESS_DIR)) {
    fs.mkdirSync(PROGRESS_DIR, { recursive: true });
  }
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Load progress data from a runtime ZIP archive.
 * The runtime ZIP contains generator output plus a `progress/` folder.
 */
function loadFromZip(zipPath) {
  if (!fs.existsSync(zipPath)) {
    throw new Error(`ZIP file not found: ${zipPath}`);
  }

  const zip = new AdmZip(zipPath);
  const progressEntry = zip.getEntry(`${PROGRESS_FOLDER_NAME}/progress.json`);

  if (!progressEntry) {
    return null;
  }

  return JSON.parse(progressEntry.getData().toString('utf-8'));
}

/**
 * Save progress data into a runtime ZIP archive.
 * If the ZIP exists, it updates the progress/ folder inside it.
 * If it doesn't exist, it creates a new ZIP with just the progress data.
 */
function saveToZip(zipPath, progressData) {
  let zip;

  if (fs.existsSync(zipPath)) {
    zip = new AdmZip(zipPath);
  } else {
    zip = new AdmZip();
  }

  const jsonData = JSON.stringify(progressData, null, 2);
  const entry = zip.getEntry(`${PROGRESS_FOLDER_NAME}/progress.json`);

  if (entry) {
    zip.updateFile(`${PROGRESS_FOLDER_NAME}/progress.json`, Buffer.from(jsonData, 'utf-8'));
  } else {
    zip.addFile(`${PROGRESS_FOLDER_NAME}/progress.json`, Buffer.from(jsonData, 'utf-8'));
  }

  zip.writeZip(zipPath);
}

module.exports = { load, save, loadFromZip, saveToZip };
