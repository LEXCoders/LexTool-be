import { Router } from 'express'
import { jwtAuth } from '../middlewares/jwtAuth.js'
import * as ProductsController from '../controllers/Products.js'
import { validateRequestBody } from '../middlewares/validateRequestBody.js'
import { updateProductPriceValidation } from '../validators/products.js'

const router = new Router()

router.get('/', jwtAuth, ProductsController.FindProducts)
router.put(
  '/',
  jwtAuth,
  updateProductPriceValidation,
  validateRequestBody,
  ProductsController.UpdatePrice
)

export default router
