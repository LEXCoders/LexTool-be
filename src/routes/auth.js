import { Router } from 'express'
import { jwtAuth } from '../middlewares/jwtAuth.js'
import { validateRequestBody } from '../middlewares/validateRequestBody.js'
import {
  authValidation,
  signUpValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  verifyCodeValidation,
  updateProfileValidation
} from '../validators/auth.js'
import { upload } from '../config/multer.js'
import * as AuthController from '../controllers/Auth.js'

const router = new Router()

router.post(
  '/sign-in',
  authValidation,
  validateRequestBody,
  AuthController.SignIn
)
router.post(
  '/sign-up',
  signUpValidation,
  validateRequestBody,
  AuthController.SignUp
)
router.post(
  '/forget-password',
  forgetPasswordValidation,
  validateRequestBody,
  AuthController.ForgetPassword
)
router.patch(
  '/reset-password',
  resetPasswordValidation,
  validateRequestBody,
  AuthController.ResetPassword
)
router.patch(
  '/change-password',
  jwtAuth,
  changePasswordValidation,
  validateRequestBody,
  AuthController.ChangePassword
)

router.post(
  '/verify-code',
  jwtAuth,
  verifyCodeValidation,
  validateRequestBody,
  AuthController.VerifyCode
)

router.patch(
  '/profile',
  jwtAuth,
  updateProfileValidation,
  validateRequestBody,
  upload.single('profileImage'),
  AuthController.UpdateProfile
)

export default router
