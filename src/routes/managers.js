import { Router } from 'express'
import { jwtAuth } from '../middlewares/jwtAuth.js'
import { isAdmin } from '../middlewares/isAdmin.js'
import { forgetPasswordValidation } from '../validators/auth.js'
import { editManagerProfileValidation } from '../validators/managers.js'
import { validateRequestBody } from '../middlewares/validateRequestBody.js'
import * as ManagersController from '../controllers/Managers.js'

const router = new Router()

router.get('/', jwtAuth, isAdmin, ManagersController.GetManagers)
router.get('/:id', jwtAuth, isAdmin, ManagersController.GetManager)
router.post(
  '/',
  jwtAuth,
  isAdmin,
  forgetPasswordValidation,
  validateRequestBody,
  ManagersController.AddManager
)
router.delete('/:id', jwtAuth, isAdmin, ManagersController.DeleteManager)
router.patch(
  '/:id',
  jwtAuth,
  isAdmin,
  editManagerProfileValidation,
  validateRequestBody,
  ManagersController.EditManagerProfile
)

export default router
