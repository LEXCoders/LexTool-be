import { validationResult } from 'express-validator'
import { sendErrorResponse } from '../utils/response.js'
import { StatusCodes } from 'http-status-codes'

export const validateRequestBody = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      errors.array().map((error) => error.msg)
    )
  }

  next()
}
