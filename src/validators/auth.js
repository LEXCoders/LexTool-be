import {
  emailValidation,
  passwordValidation,
  nameValidation,
  codeValidation,
  tokenValidation
} from './index.js'

export const authValidation = [emailValidation(), passwordValidation()]

export const signUpValidation = [
  emailValidation(),
  passwordValidation(),
  nameValidation(),
  nameValidation('lastName')
]

export const forgetPasswordValidation = [emailValidation()]

export const resetPasswordValidation = [passwordValidation(), tokenValidation()]

export const changePasswordValidation = [
  passwordValidation('newPassword'),
  passwordValidation('currentPassword')
]

export const verifyCodeValidation = [emailValidation(), codeValidation()]

export const updateProfileValidation = [
  emailValidation().optional(),
  nameValidation().optional(),
  nameValidation('lastName').optional()
]
