import db from '../config/sequelize.js'
import { StatusCodes } from 'http-status-codes'
import { sendErrorResponse } from '../utils/response.js'
import { Roles } from '../constants/roles.js'
import { transporter } from '../services/mailer.js'
import { MAILER_USER, APP_URL } from '../config/env.js'
import { generateToken } from '../services/jwt.js'
import { Op } from 'sequelize'

export const GetManagers = async (req, res) => {
  try {
    const { page = 0, search = '' } = req.query

    const pageNumber = parseInt(page, 10)
    const limit = 5
    const offset = pageNumber * limit

    const searchFilter = search
      ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        }
      : {}

    const managers = await db.models.User.findAll({
      where: {
        role: Roles.MANAGER,
        ...searchFilter
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
      limit,
      offset
    })

    const totalCount = await db.models.User.count({
      where: {
        role: Roles.MANAGER,
        ...searchFilter
      }
    })

    return res.status(StatusCodes.OK).json({
      managers,
      totalCount
    })
  } catch (e) {
    console.error('[GetManagers]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error getting managers'
    )
  }
}

export const GetManager = async (req, res) => {
  try {
    const { id } = req.params

    const manager = await db.models.User.findOne({
      where: {
        id
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'role']
    })

    if (!manager) {
      return sendErrorResponse(res, StatusCodes.NOT_FOUND, 'Manager not found')
    }

    return res.status(StatusCodes.OK).json({ manager })
  } catch (e) {
    console.error('[GetManager]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error getting manager'
    )
  }
}

export const AddManager = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body

    const existingManager = await db.models.User.findOne({ where: { email } })

    if (existingManager) {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        'User with this email already'
      )
    }

    await db.models.User.create({
      email,
      firstName,
      lastName,
      password: null,
      isVerified: false
    })

    const token = generateToken({ email })

    await transporter.sendMail({
      from: MAILER_USER,
      to: email,
      subject: 'Manager invitation',
      text: "You've been added as manager",
      html: `<h1> Follow the link to create account and join the team: </h1> <br> <a href="${APP_URL}?accessToken=${token}"> Link </a>`
    })

    return res
      .status(StatusCodes.CREATED)
      .json({ message: 'Invitation sent successfully!' })
  } catch (e) {
    console.error('[AddManager]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error while adding the manager'
    )
  }
}

export const DeleteManager = async (req, res) => {
  try {
    const { id } = req.params

    const manager = await db.models.User.findOne({ where: { id } })

    if (!manager) {
      return sendErrorResponse(res, StatusCodes.NOT_FOUND, 'Manager not found')
    }

    await manager.destroy({ force: true })

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Manager deleted successfully!' })
  } catch (e) {
    console.error('[DeleteManager]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error while deleting the manager'
    )
  }
}

export const EditManagerProfile = async (req, res) => {
  try {
    const { email, firstName, lastName, role } = req.body
    const { id } = req.params

    await db.models.User.update(
      {
        ...(email ? { email } : {}),
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
        ...(role ? { role } : {})
      },
      { where: { id } }
    )

    return res
      .status(StatusCodes.OK)
      .json({ message: "User's profile successfully updated!" })
  } catch (e) {
    console.error('[EditManagerProfile]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Error while updating manager's profile"
    )
  }
}
