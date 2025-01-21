import { DataTypes } from 'sequelize'

const modelDefiner = (sequelize) => {
  return sequelize.define(
    'Category',
    {
      name: {
        type: DataTypes.STRING
      },
      marginalb2b: {
        type: DataTypes.STRING
      },
      marginalb2bs: {
        type: DataTypes.STRING
      },
      marginalb2w: {
        type: DataTypes.STRING
      },
      marginalb2c: {
        type: DataTypes.STRING
      }
    },
    { tableName: 'category', timestamps: true }
  )
}

export default modelDefiner
