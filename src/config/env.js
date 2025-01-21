import { config } from 'dotenv'
config()

const getEnvVar = (key, required = true) => {
  if (!Object.prototype.hasOwnProperty.call(process.env, key) && required) {
    throw new Error(`${key} does not exist on process.env`)
  }

  return process.env[key]
}

export const DB_HOST = getEnvVar('DB_HOST')
export const DB_PORT = Number(getEnvVar('DB_PORT'))
export const DB_NAME = getEnvVar('DB_NAME')
export const DB_USER = getEnvVar('DB_USER')
export const DB_PASSWORD = getEnvVar('DB_PASSWORD')
export const PORT = getEnvVar('PORT', false) ?? 3000
export const JWT_SECRET_KEY = getEnvVar('JWT_SECRET_KEY', false) ?? 'secReT-KEy'
export const APP_URL = getEnvVar('APP_URL')
export const MAILER_PORT = getEnvVar('MAILER_PORT')
export const MAILER_HOST = getEnvVar('MAILER_HOST')
export const MAILER_USER = getEnvVar('MAILER_USER')
export const MAILER_PASSWORD = getEnvVar('MAILER_PASSWORD')
export const VISMA_CLIENT_ID = getEnvVar('VISMA_CLIENT_ID')
export const VISMA_CLIENT_SECRET = getEnvVar('VISMA_CLIENT_SECRET')
export const VISMA_TENANT_ID = getEnvVar('VISMA_TENANT_ID')
export const ENAD_AUTH_TOKEN = getEnvVar('ENAD_AUTH_TOKEN')
export const ENAD_API_URL = getEnvVar('ENAD_API_URL')
export const ENAD_USER_AGENT = getEnvVar('ENAD_USER_AGENT')
