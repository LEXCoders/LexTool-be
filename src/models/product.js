import { DataTypes } from 'sequelize'

const modelDefiner = (sequelize) => {
  return sequelize.define(
    'Product',
    {
      inventoryId: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      internalId: {
        type: DataTypes.INTEGER,
        unique: true
      },
      description: {
        type: DataTypes.STRING
      },
      baseUnit: {
        type: DataTypes.STRING
      }
    },
    { tableName: 'product', timestamps: true }
  )
}

export default modelDefiner
