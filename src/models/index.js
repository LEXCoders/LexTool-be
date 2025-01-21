import db from '../config/sequelize.js'

export const createAssociations = () => {
  db.models.Product.hasMany(db.models.ProductAvailability, {
    foreignKey: 'inventoryId',
    as: 'availability'
  })
  db.models.ProductAvailability.belongsTo(db.models.Product, {
    foreignKey: 'inventoryId',
    as: 'availability'
  })
}
