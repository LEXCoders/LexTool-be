import express, { json } from 'express'
import { PORT } from './config/env.js'
import mainRouter from './routes/index.js'
import cors from 'cors'
import { UPLOADS_DIRECTORY_PATH } from './constants/uploads.js'

export const initExpress = () => {
  const app = express()

  app.use(json())
  app.use(cors())

  app.use('/', mainRouter)

  app.use('/uploads/profile-pics', express.static(UPLOADS_DIRECTORY_PATH))

  app.listen(PORT, () => console.info(`App listening on port ${PORT}`))
}
