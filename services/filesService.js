const https = require('https');
const config = require('../utils/config');

function fetchJson(url) {
  console.log('\x1b[32m[filesService] fetchJson:', url, '\x1b[0m');
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { authorization: `Bearer ${config.API_KEY}` } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function fetchCsv(url) {
  console.log('\x1b[32m[filesService] fetchCsv:', url, '\x1b[0m');
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { authorization: `Bearer ${config.API_KEY}` } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseCsv(csv, fileName) {
  console.log('\x1b[32m[filesService] parseCsv:', fileName, '\x1b[0m');
  const lines = csv.split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const header = lines[0].split(',');
  if (header.length !== 4) return [];
  return lines.slice(1).map(line => {
    const cols = line.split(',');
    if (cols.length !== 4) return null;
    if (cols[0] !== fileName) return null;
    return {
      text: cols[1],
      number: Number(cols[2]),
      hex: cols[3]
    };
  }).filter(Boolean);
}

async function getFilesList() {
  console.log('\x1b[32m[filesService] getFilesList\x1b[0m');
  const filesResp = await fetchJson(`${config.API_URL}/files`);
  if (!filesResp.files || !Array.isArray(filesResp.files)) {
    throw new Error('Invalid files list');
  }
  return filesResp.files;
}

async function getFilesData(fileName) {
  console.log('\x1b[32m[filesService] getFilesData', fileName ? `with filter: ${fileName}` : '', '\x1b[0m');
  const filesResp = await fetchJson(`${config.API_URL}/files`);
  if (!filesResp.files || !Array.isArray(filesResp.files)) {
    throw new Error('Invalid files list');
  }
  let filesToFetch = filesResp.files;
  if (fileName) {
    filesToFetch = filesResp.files.filter(f => f === fileName);
  }
  const results = await Promise.all(filesToFetch.map(async (file) => {
    try {
      const csv = await fetchCsv(`${config.API_URL}/file/${file}`);
      const lines = parseCsv(csv, file);
      return { file, lines };
    } catch (e) {
      return { file, lines: [] };
    }
  }));
  return results;
}

module.exports = {
  getFilesList,
  getFilesData,
  fetchJson,
  fetchCsv,
  parseCsv
};
