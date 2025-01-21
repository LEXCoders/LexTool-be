import { StatusCodes } from 'http-status-codes'
import { verifyToken } from '../services/jwt.js'
import { sendErrorResponse } from '../utils/response.js'

export const jwtAuth = (req, res, next) => {
  const token = req.header('authorization')?.split(' ')?.[1]
  if (!token) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED)
  }

  try {
    const verifiedUser = verifyToken(token)

    req.email = verifiedUser.email
  } catch (e) {
    console.error(e)
    return sendErrorResponse(res, StatusCodes.FORBIDDEN, 'Invalid Token')
  }

  next()
}
