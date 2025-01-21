import {
  onSaleValidation,
  statusValidation,
  tokenValidation,
  priceValidation
} from './index.js'

export const updateProductPriceValidation = [
  tokenValidation('market_slug'),
  tokenValidation('variant_id'),
  tokenValidation('variant_name'),
  tokenValidation('store_group_slug'),
  tokenValidation('product_id'),
  onSaleValidation(),
  statusValidation(),
  tokenValidation('brand').optional(),
  tokenValidation('category').optional(),
  tokenValidation('variant_name'),
  priceValidation()
]
