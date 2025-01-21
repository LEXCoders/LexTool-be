import { DataTypes } from 'sequelize'
import { Roles } from '../constants/roles.js'

const modelDefiner = (sequelize) => {
  return sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[Roles.ADMIN, Roles.MANAGER]]
        },
        defaultValue: Roles.MANAGER
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    { tableName: 'user', timestamps: true }
  )
}

export default modelDefiner
