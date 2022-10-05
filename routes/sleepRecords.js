const express = require('express')
const router = express.Router()

const {getAllSleepRecords, getSleepRecord, createSleepRecord, updateSleepRecord, deleteSleepRecord} = require('../controllers/sleepRecords')

router.route('/').post(createSleepRecord).get(getAllSleepRecords)
router.route('/:id').get(getSleepRecord).patch(updateSleepRecord).delete(deleteSleepRecord)

module.exports = router