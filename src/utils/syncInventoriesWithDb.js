import db from '../config/sequelize.js'

export const syncInventoriesWithDb = async (inventories) => {
  await Promise.all(
    inventories.map(async (inventory) => {
      const [product, created] = await db.models.Product.findOrCreate({
        where: { inventoryId: inventory.inventoryId },
        defaults: {
          inventoryId: inventory.inventoryId,
          internalId: inventory.internalId,
          description: inventory.description,
          baseUnit: inventory.baseUnit
        }
      })

      if (created) {
        await Promise.all(
          inventory.availability.map(async (availabilityData) => {
            await db.models.ProductAvailability.create({
              ...availabilityData,
              inventoryId: product.inventoryId
            })
          })
        )
      }
    })
  )
}
