import { StatusCodes } from 'http-status-codes'
import { sendErrorResponse } from '../utils/response.js'
import { INVENTORY_ROUTE } from '../constants/routes.js'
import { VISMA_SALESORDER_API } from '../constants/api.js'
import { getAuthToken } from '../utils/token.js'
import axios from 'axios'
import db from '../config/sequelize.js'
import { Op } from 'sequelize'
import { syncInventoriesWithDb } from '../utils/syncInventoriesWithDb.js'
import {
  ENAD_API_URL,
  ENAD_AUTH_TOKEN,
  ENAD_USER_AGENT
} from '../config/env.js'
import { calculateMarginal, calculatePrice } from '../utils/calculation.js'

export const FindProducts = async (req, res) => {
  try {
    let products = await db.models.Product.findAll({
      where: {
        ...(req.query.inventoryId
          ? { inventoryId: { [Op.in]: [req.query.inventoryId].flat() } }
          : {})
      },
      limit: req.query.limit ?? 100,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: [
        {
          model: db.models.ProductAvailability,
          as: 'availability',
          attributes: {
            exclude: ['id', 'inventoryId', 'createdAt', 'updatedAt']
          }
        }
      ]
    })

    if (!products.length) {
      const token = await getAuthToken()

      if (!token) {
        return sendErrorResponse(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Error while fetching the products'
        )
      }

      const { data } = await axios.get(
        `${VISMA_SALESORDER_API}${INVENTORY_ROUTE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: req.query
        }
      )

      await syncInventoriesWithDb(data.value)

      products = data.value
    }

    if (!products.length) {
      return sendErrorResponse(res, StatusCodes.NOT_FOUND, 'Product not found')
    }

    return res.status(StatusCodes.OK).json({ products })
  } catch (e) {
    console.error('[FindProducts]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error while fetching the products'
    )
  }
}

export const UpdatePrice = async (req, res) => {
  try {
    const {
      brand,
      category,
      latest_price,
      variant_id,
      variant_name,
      market_slug,
      store_group_slug,
      product_id,
      on_sale,
      status
    } = req.body

    const marginal = await calculateMarginal(brand, category)
    const price = calculatePrice(latest_price, marginal, variant_name)

    if (price) {
      const body = {
        market_slug,
        store_group_slug,
        on_sale,
        status,
        amount_cents_with_tax: Number(price),
        sale_price_with_tax: Number(price)
      }

      const { data } = await axios.put(
        `${ENAD_API_URL}/products/${product_id}/variants/${variant_id}/prices`,
        body,
        {
          headers: {
            Authorization: `Bearer ${ENAD_AUTH_TOKEN}`,
            'User-Agent': ENAD_USER_AGENT,
            Accept: 'application/json'
          }
        }
      )

      if (data.success) {
        return res
          .status(StatusCodes.OK)
          .json({ message: 'Price updated successfully' })
      }
    }

    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Couldn't calculate price of the product"
    )
  } catch (e) {
    console.error('[UpdatePrice]', e)
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Error while updating product price'
    )
  }
}
