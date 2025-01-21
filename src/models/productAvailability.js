import { DataTypes } from 'sequelize'

const modelDefiner = (sequelize) => {
  return sequelize.define(
    'ProductAvailability',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      inventoryId: {
        type: DataTypes.STRING
      },
      internalWarehouseId: {
        type: DataTypes.INTEGER
      },
      warehouseId: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      quantityOnHand: {
        type: DataTypes.INTEGER
      },
      quantityAvailable: {
        type: DataTypes.INTEGER
      },
      quantityAvailableForShipment: {
        type: DataTypes.INTEGER
      },
      quantityNotAvailable: {
        type: DataTypes.INTEGER
      },
      quantityPurchaseOrders: {
        type: DataTypes.INTEGER
      },
      estimatedUnitCost: {
        type: DataTypes.FLOAT
      },
      estimatedTotalCost: {
        type: DataTypes.FLOAT
      }
    },
    { tableName: 'product_availability', timestamps: true }
  )
}

export default modelDefiner
