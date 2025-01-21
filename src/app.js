import express, { json } from 'express'
import { PORT } from './config/env.js'
import mainRouter from './routes/index.js'

export const initExpress = () => {
  const app = express()

  app.use(json())

  app.use('/', mainRouter)

  app.listen(PORT, () => console.info(`App listening on port ${PORT}`))
}
