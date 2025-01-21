import { StatusCodes } from 'http-status-codes'
import db from '../config/sequelize.js'
import { Roles } from '../constants/roles.js'
import { sendErrorResponse } from '../utils/response.js'

export const isAdmin = async (req, res, next) => {
  try {
    const user = await db.models.User.findOne({ where: { email: req.email } })

    if (user?.role !== Roles.ADMIN || !user?.role) {
      return sendErrorResponse(
        res,
        StatusCodes.FORBIDDEN,
        'You do not have the required permissions.'
      )
    }
  } catch (e) {
    console.error('[isAdmin]', e)
    return sendErrorResponse(
      res,
      StatusCodes.FORBIDDEN,
      'Error while checking user role.'
    )
  }

  next()
}
