import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { VISMA_CONNECT_API } from '../constants/api.js'
import { GENERATE_TOKEN_ROUTE } from '../constants/routes.js'
import {
  VISMA_CLIENT_ID,
  VISMA_CLIENT_SECRET,
  VISMA_TENANT_ID
} from '../config/env.js'

let token
let expiresIn

const isTokenExpired = () => {
  const decodedToken = jwtDecode(token)
  const issuedAt = decodedToken.iat
  const expirationTime = issuedAt + expiresIn
  const currentTime = Math.floor(Date.now() / 1000)

  return currentTime >= expirationTime
}

const getTokenFromService = async () => {
  try {
    const body = {
      grant_type: 'client_credentials',
      scope: 'visma.net.erp.salesorder:read visma.net.erp.salesorder:write',
      client_id: VISMA_CLIENT_ID,
      client_secret: VISMA_CLIENT_SECRET,
      tenant_id: VISMA_TENANT_ID
    }
    const { data } = await axios.post(
      `${VISMA_CONNECT_API}${GENERATE_TOKEN_ROUTE}`,
      new URLSearchParams(body),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    token = data.access_token
    expiresIn = data.expires_in
  } catch (e) {
    console.error('[getTokenFromService]', e)
  }
}

export const getAuthToken = async () => {
  if (!token || isTokenExpired()) {
    await getTokenFromService()
  }

  return token
}
