import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'
import './SellerText.css'

const CSS_HANDLES = ['sellerDiv', 'sellerText']

const SellerText = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const productContextValue = useProduct()
  const sellers = productContextValue?.selectedItem?.sellers
  const sellerDefault =
    sellers?.find(seller => seller.sellerDefault) ?? sellers?.[0]

  if (!sellerDefault) return null

  return (
    <div className={`${handles.sellerDiv}`}>
      {productContextValue ? (
        <p className={`${handles.sellerText}`}>
          Vendido e entregue por: {sellerDefault.sellerName}
        </p>
      ) : (
        ''
      )}
    </div>
  )
}

export default SellerText
