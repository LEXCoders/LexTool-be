import { body } from 'express-validator'

export const emailValidation = (key = 'email') =>
  body(key).isEmail().withMessage('Invalid email address')

export const passwordValidation = (key = 'password') =>
  body(key)
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long')

export const tokenValidation = (key = 'token') =>
  body(key)
    .exists({ checkFalsy: true })
    .withMessage('Token is required')
    .isString()
    .withMessage('Token must be a string')
    .isLength({ min: 1 })
    .withMessage('Token must not be empty')

export const nameValidation = (key = 'firstName') =>
  body(key)
    .exists({ checkFalsy: true })
    .withMessage(`${key} is required`)
    .isString()
    .withMessage(`${key} must be a string`)
    .isLength({ min: 3 })

export const codeValidation = (key = 'code') =>
  body(key)
    .exists({ checkFalsy: true })
    .withMessage(`${key} is required`)
    .isString()
    .withMessage(`${key} must be a string`)
    .isLength({ min: 6, max: 6 })
    .withMessage(`${key} must be exactly 6 characters long`)
    .matches(/^\d{6}$/)
    .withMessage(`${key} must be a string of 6 digits`)

export const roleValidation = (key = 'role') =>
  body(key).isIn([1, 2]).withMessage('Role must be either 1 or 2')

export const onSaleValidation = (key = 'on_sale') =>
  body(key).isBoolean().optional()

export const statusValidation = (key = 'status') =>
  body(key).isIn(['active', 'draft', 'inactive'])

export const priceValidation = (key = 'latest_price') =>
  body(key)
    .custom((value) => {
      if (typeof value === 'number') {
        return true
      }
      if (typeof value === 'string' && !isNaN(value.trim())) {
        return true
      }
      throw new Error('Price must be a valid number or numeric string.')
    })
    .trim()
