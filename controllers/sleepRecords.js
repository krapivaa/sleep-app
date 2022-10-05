const SleepRecord = require('../models/SleepRecord')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllSleepRecords = async (req, res) => {
    const sleepRecords = await SleepRecord.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({sleepRecords, count: sleepRecords.length})
}

const getSleepRecord = async (req, res) => {
     const {user: {userId}, params: {id: sleepRecordId}} = req
     const sleepRecord = await SleepRecord.findOne({
        _id: sleepRecordId,
        createdBy: userId
     })
    if (!sleepRecord) {
        throw new NotFoundError(`No sleep record with id ${sleepRecordId} found.`)
    }
    res.status(StatusCodes.OK).json({sleepRecord})
}

const createSleepRecord = async (req, res) => {
     req.body.createdBy = req.user.userId
     const sleepRecord = await SleepRecord.create(req.body)
     res.status(StatusCodes.CREATED).json({sleepRecord})
}

const updateSleepRecord = async (req, res) => {
    const {
        body: {date, time},
        user: {userId},
        params: {id: sleepRecordId},
      } = req
      if (date === '' || time === '') {
        throw new BadRequestError('Date or Time fields cannot be empty.')
      }
      const sleepRecord = await SleepRecord.findByIdAndUpdate(
        {_id: sleepRecordId, createdBy: userId},
        req.body,
        {new: true, runValidators: true}
      )
      if (!sleepRecord) {
        throw new NotFoundError(`No sleep record with id ${sleepRecordId} found.`)
      }
      res.status(StatusCodes.OK).json({sleepRecord})
}

const deleteSleepRecord = async (req, res) => {
    const {
        user: {userId},
        params: {id: sleepRecordId},
      } = req
      const sleepRecord = await SleepRecord.findByIdAndRemove({
        _id: sleepRecordId,
        createdBy: userId,
      })
      if (!sleepRecord) {
        throw new NotFoundError(`No sleep record with id ${sleepRecordId} found.`)
      }
      res.status(StatusCodes.OK).json({msg: "The sleep record entry was deleted."})
}



module.exports = {
    getAllSleepRecords, 
    getSleepRecord,
    createSleepRecord,
    updateSleepRecord,
    deleteSleepRecord
}