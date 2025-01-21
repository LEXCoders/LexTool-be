import db from '../config/sequelize.js'

export const calculatePrice = (latestEntryPrice, marginal) =>
  1 - latestEntryPrice !== 0 ? marginal / (1 - latestEntryPrice) : ''

export const calculateMarginal = async (brand, underCategory, type) => {
  let data = brand
    ? await db.models.Brand.findOne({ where: { name: brand } })
    : null

  if (!data && underCategory) {
    data = await db.models.Category.findOne({ where: { name: underCategory } })
  }

  return data?.[type] ?? ''
}
