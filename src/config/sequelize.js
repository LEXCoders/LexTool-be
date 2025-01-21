import { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } from './env.js'
import { Sequelize } from 'sequelize'
import mysql from 'mysql2'
import UserModel from '../models/user.js'
import ProductModel from '../models/product.js'
import ProductAvailabilityModel from '../models/productAvailability.js'
import CategoryModel from '../models/category.js'
import BrandModel from '../models/brand.js'
import { createAssociations } from '../models/index.js'

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  dialectModule: mysql,
  logging: false
})

const assertDatabaseConnectionOk = async () => {
  console.info(`Checking database connection...`)

  try {
    await sequelize.authenticate()
    console.info('Database connection OK.')
  } catch (e) {
    console.error('Unable to connect to the database:', e)
    throw e
  }
}

const modelDefiners = [
  UserModel,
  ProductModel,
  ProductAvailabilityModel,
  CategoryModel,
  BrandModel
]

const defineModels = async () => {
  for (const modelDefiner of modelDefiners) {
    const model = modelDefiner(sequelize)

    await model.sync()
  }
}

export const initSequelize = async () => {
  await assertDatabaseConnectionOk()
  await defineModels()
  createAssociations()
}

export default sequelize
