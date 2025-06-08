const express = require('express')
const router = express.Router()
const apiKeyMiddleware = require('../middleware/auth')
const { filesDataHandler, filesListHandler } = require('../controllers/filesController')

router.use(apiKeyMiddleware)

router.get('/data', filesDataHandler)
router.get('/list', filesListHandler)

module.exports = router 