import cron from 'node-cron'
import { VISMA_SALESORDER_API } from '../constants/api.js'
import { INVENTORY_ROUTE } from '../constants/routes.js'
import axios from 'axios'
import { getAuthToken } from '../utils/token.js'
import { syncInventoriesWithDb } from '../utils/syncInventoriesWithDb.js'

export const syncData = async () => {
  cron.schedule('0 0 * * 0', async () => {
    console.info('Starting sync')
    try {
      const token = await getAuthToken()

      if (!token) {
        console.warn('No token available, skipping sync.')
        return
      }

      let requestUrl = `${VISMA_SALESORDER_API}${INVENTORY_ROUTE}`

      while (requestUrl) {
        const { data } = await axios.get(requestUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 10000
        })

        if (data.value && data.value.length) {
          await syncInventoriesWithDb(data.value)
        }

        requestUrl = data.nextPage
      }

      console.info('Products synced successfully!')
    } catch (e) {
      console.error('[syncData]', e)
    }
  })
}
