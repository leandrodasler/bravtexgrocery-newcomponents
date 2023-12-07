import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { ProductContext } from 'vtex.product-context'
import { useProductDispatch } from 'vtex.product-context/ProductDispatchContext'
import { ExtensionPoint } from 'vtex.render-runtime'
import { NumericStepper } from 'vtex.styleguide'
import './AddToCartQuantityStepper.css'

const CSS_HANDLES = [
  'containerAddCartButton',
  'containerQuantity',
  'contentAddedToCartTxt',
  'contentQuantity',
]

const AddToCartQuantityStepper = () => {
  const intl = useIntl()
  const { updateQuantity } = useOrderItems()
  const dispatch = useProductDispatch()
  const handles = useCssHandles(CSS_HANDLES)
  const selectedItem = useContext(ProductContext)
  const orderForm = useOrderForm()
  const [quantitySelected, setQuantitySelected] = useState(0)
  const [availableQuantity, setAvailableQuantity] = useState(0)

  useEffect(() => {
    if (selectedItem) {
      setQuantitySelected(Number(selectedItem.selectedQuantity))
      setAvailableQuantity(
        Number(
          selectedItem?.selectedItem?.sellers[0].commertialOffer
            .AvailableQuantity
        )
      )
    }
  }, [selectedItem])

  const onChange = useCallback(
    event => {
      const productUniqueId = orderForm?.orderForm?.items.find((item: any) => {
        return item?.id === selectedItem?.selectedItem?.itemId
      })

      if (+event.value !== 0) {
        dispatch({ type: 'SET_QUANTITY', args: { quantity: event.value } })
      } else {
        dispatch({ type: 'SET_QUANTITY', args: { quantity: 1 } })
      }

      updateQuantity({
        uniqueId: productUniqueId?.uniqueId,
        quantity: event.value,
      })
    },
    [orderForm]
  )

  const handleNumericClick: React.MouseEventHandler<HTMLDivElement> = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  const isAddedItem = useMemo(() => {
    const foundItemCart = orderForm?.orderForm?.items.find(
      (item: any) =>
        item && selectedItem && selectedItem?.selectedItem?.itemId === item.id
    )

    if (foundItemCart) {
      dispatch({
        type: 'SET_QUANTITY',
        args: { quantity: foundItemCart.quantity },
      })

      return true
    }

    return false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderForm?.orderForm?.items])

  return (
    <div className={`${handles.containerAddCartButton} pb4 pt0`}>
      {!isAddedItem ? (
        <ExtensionPoint id="add-to-cart-button" />
      ) : (
        <div
          className={`${handles.containerQuantity}`}
          onClick={handleNumericClick}
          onKeyUp={() => undefined}
          role="button"
          tabIndex={0}
        >
          <div className={`${handles.contentQuantity} mb2`}>
            <NumericStepper
              size="regular"
              minValue={0}
              onChange={onChange}
              unitMultiplier={selectedItem?.selectedItem?.unitMultiplier ?? 1}
              value={quantitySelected}
              maxValue={availableQuantity || undefined}
            />
          </div>
          <span className={`${handles.contentAddedToCartTxt} `}>
            {intl.formatMessage({
              id: 'store.quantity-stepper.addedToCart.label',
            })}
          </span>
        </div>
      )}
    </div>
  )
}

export default AddToCartQuantityStepper
