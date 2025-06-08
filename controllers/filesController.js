const { getFilesData, getFilesList } = require('../services/filesService')

async function filesDataHandler (req, res) {
  console.log('\x1b[32m[filesController] filesDataHandler\x1b[0m')
  try {
    const { fileName } = req.query
    const results = await getFilesData(fileName)
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch files' })
  }
}

async function filesListHandler (req, res) {
  console.log('\x1b[32m[filesController] filesListHandler\x1b[0m')
  try {
    const files = await getFilesList()
    if (!Array.isArray(files)) {
      return res.status(500).json({ error: 'Failed to fetch files list' })
    }
    res.json({ files })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch files list' })
  }
}

module.exports = { filesDataHandler, filesListHandler }
