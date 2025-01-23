import db from '../config/sequelize.js'
import { hash, compare } from '../utils/password.js'
import { sendErrorResponse } from '../utils/response.js'
import { generateToken } from '../services/jwt.js'
import { StatusCodes } from 'http-status-codes'
import { transporter } from '../services/mailer.js'
import { MAILER_USER } from '../config/env.js'
import { generateRandomCode } from '../utils/random.js'

export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await db.models.User.findOne({ where: { email } })

    if (!user) {
      return sendErrorResponse(res, StatusCodes.NOT_FOUND, 'User not found')
    }

    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      return sendErrorResponse(res, StatusCodes.FORBIDDEN, 'Invalid password')
    }

    const token = generateToken({ email: email })

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Logged in successfully', token })
  } catch (e) {
    console.error('[SignIn]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error while signing in'
    )
  }
}

export const SignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    const user = await db.models.User.findOne({ where: { email } })

    if (user) {
      return sendErrorResponse(res, StatusCodes.CONFLICT, 'User already exists')
    }

    const hashedPassword = await hash(password)

    await db.models.User.create({
      email: email,
      password: hashedPassword,
      isVerified: true,
      firstName,
      lastName
    })

    const token = generateToken({ email: email })

    return res
      .status(StatusCodes.CREATED)
      .json({ message: 'User successfully created', token })
  } catch (e) {
    console.error('[SignUp]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error while signing in'
    )
  }
}

export const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body

    const code = generateRandomCode()

    await transporter.sendMail({
      from: MAILER_USER,
      to: email,
      subject: 'Forget password',
      text: `Confirmation code: ${code}`,
      html: `<h1> Confirmation code: </h1> <br> <span> ${code} </span>`
    })

    await db.models.User.update({ code }, { where: { email } })

    return res
      .status(StatusCodes.CREATED)
      .json({ message: 'The reset link sent successfully' })
  } catch (e) {
    console.error('[ForgetPassword]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error while sending reset link'
    )
  }
}

export const VerifyCode = async (req, res) => {
  try {
    const { email, code } = req.body

    const user = await db.models.User.findOne({ where: { email } })

    if (user.code !== code) {
      return sendErrorResponse(
        res,
        StatusCodes.FORBIDDEN,
        'Invalid confirmation code'
      )
    }

    const token = generateToken({ email })

    user.code = null
    await user.save()

    return res.status(StatusCodes.OK).json({ token })
  } catch (e) {
    console.error('[ResetPassword]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error resetting password'
    )
  }
}

export const ResetPassword = async (req, res) => {
  try {
    const { password } = req.body

    const hashedPassword = await hash(password)

    await db.models.User.update(
      { password: hashedPassword, isVerified: true },
      { where: { email: req.email } }
    )

    return res
      .status(StatusCodes.CREATED)
      .json({ message: 'The password reseted successfully' })
  } catch (e) {
    console.error('[ResetPassword]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error resetting password'
    )
  }
}

export const ChangePassword = async (req, res) => {
  try {
    const { email } = req
    const { newPassword, currentPassword } = req.body

    const user = await db.models.User.findOne({ where: { email } })

    const isValidCurrentPassword = await compare(currentPassword, user.password)

    if (!isValidCurrentPassword) {
      return sendErrorResponse(
        res,
        StatusCodes.FORBIDDEN,
        'Invalid current password!'
      )
    }

    const hashedNewPassword = await hash(newPassword)

    user.password = hashedNewPassword
    await user.save()

    return res
      .status(StatusCodes.CREATED)
      .json({ message: 'Password successfully changed' })
  } catch (e) {
    console.error('[ChangePassword]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error changing the password'
    )
  }
}

export const UpdateProfile = async (req, res) => {
  try {
    const { email: currentEmail } = req
    const { email, firstName, lastName } = req.body

    const user = await db.models.User.findOne({
      where: { email: currentEmail }
    })

    if (!user) {
      return sendErrorResponse(res, StatusCodes.NOT_FOUND, 'User not found')
    }

    Object.assign(user, {
      email: email ?? user.email,
      firstName: firstName ?? user.firstName,
      lastName: lastName ?? user.lastName
    })

    const token = generateToken({ email: email ?? user.email })

    await user.save()

    return res
      .status(StatusCodes.OK)
      .json({ message: 'The profile updated successfully', token })
  } catch (e) {
    console.error('[UpdateSettings]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error updating settings'
    )
  }
}

export const Me = async (req, res) => {
  try {
    const { email } = req

    const userProfile = await db.models.User.findOne({
      where: { email },
      attributes: ['id', 'firstName', 'lastName', 'email', 'role']
    })

    if (!userProfile) {
      return sendErrorResponse(res, StatusCodes.NOT_FOUND, 'User not found')
    }

    return res.status(StatusCodes.OK).json({ profile: userProfile })
  } catch (e) {
    console.error('[Me]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error while getting profile information'
    )
  }
}
