import { initExpress } from './app.js'
import { initSequelize } from './config/sequelize.js'
import { initCrons } from './cron/index.js'

const init = async () => {
  await initSequelize()
  initCrons()
  initExpress()
}

init()
