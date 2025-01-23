import { nameValidation, emailValidation, roleValidation } from './index.js'

export const editManagerProfileValidation = [
  emailValidation().optional(),
  nameValidation().optional(),
  nameValidation('lastName').optional(),
  roleValidation().optional()
]

export const addManagerValidation = [
  emailValidation(),
  nameValidation(),
  nameValidation('lastName')
]
