import { Router } from 'express'
import authRouter from './auth.js'
import managersRouter from './managers.js'
import productsRouter from './products.js'

const router = new Router()

router.use('/auth', authRouter)
router.use('/managers', managersRouter)
router.use('/products', productsRouter)

export default router
