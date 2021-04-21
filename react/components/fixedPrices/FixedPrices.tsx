import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useLazyQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'
import type { ProductTypes } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import GET_FIXED_PRICES from './GET_FIXED_PRICES.gql'
import { mapCatalogItemToCart } from './modules/catalogItemToCart'
import styles from './FixedPrices.css'

const CSS_HANDLES = [
	'containerWholesalePrice',
	'blockUnitsPrice',
	'quantityPrice',
	'containerWholesaleButton',
	'wholesaleInformations',
	'quantityPriceContainer',
	'wholesaleMinQtyAndUnit',
	'wholesaleValuePerUnits',
	'unitPrice',
	'quantityPriceText',
	'wholePriceActiveCheckMark',
	'svgCheckMark',
	'innerButtonContainer',
	'innerSVGButtonContainer',
	'innerSVG',
	'wholesaleInformationsChecked',
]

interface Product {
	productId: string
}

const FixedPrices = () => {
	const handles = useCssHandles(CSS_HANDLES)
	const orderForm = useOrderForm()
	const productContextValue = useProduct()
	const product = productContextValue?.product
	const selectedItem = productContextValue?.selectedItem
	const assemblyOptions = productContextValue?.assemblyOptions
	const seller = productContextValue?.selectedItem?.sellers[0] as ProductTypes.Seller

	const selectedQuantity = productContextValue?.selectedQuantity != null ? productContextValue.selectedQuantity : 1
	const [newStateText, setNewStateText] = useState()

	const [getPrices, { data }] = useLazyQuery(GET_FIXED_PRICES, {
		fetchPolicy: 'cache-and-network',
		variables: { itemID: Number(productContextValue?.selectedItem?.itemId) },
	})

	useEffect(() => {
		getPrices()
	}, [getPrices])

	const toFixedPrices = useCallback((price: number) => {
		return price.toFixed(2)
	}, [])

	const skuItems = useMemo(
		() =>
			mapCatalogItemToCart({
				product,
				selectedItem,
				selectedQuantity,
				selectedSeller: seller,
				assemblyOptions,
			}),
		[assemblyOptions, product, selectedItem, selectedQuantity, seller]
	)

	const validateQuantityOrderForm = orderForm?.orderForm?.items.filter(
		(item: Product) => item.productId === product?.productId
	)

	useEffect(() => {
		if (data) {
			if (data.fixedPrices?.fixedPrices[0]?.minQuantity) {
				skuItems[0].quantity =
					data.fixedPrices?.fixedPrices[0]?.minQuantity -
					(!validateQuantityOrderForm[0]?.quantity ? 0 : validateQuantityOrderForm[0]?.quantity)
			}
		}
	}, [validateQuantityOrderForm, data, skuItems])

	useEffect(() => {
		if (data) {
			if (data.fixedPrices?.fixedPrices[0]?.minQuantity) {
				const newDinamicTextButtonAddInner = (
					<div className={`${styles.innerButtonContainer} flex items-center w-100 justify-around`}>
						<div className={`${styles.wholesaleInformations} flex flex-column ttn`}>
							<span className={`${styles.quantityPriceText} flex flex-row ttn-m fw4`}>
								A partir de
								<span className={`${styles.wholesaleMinQtyAndUnit} fw7 ml2 ttn`}>
									{data.fixedPrices?.fixedPrices[0]?.minQuantity} un
								</span>
							</span>
							<span className={`${styles.unitPrice} fw7 nowrap tl`}>
								R$ {toFixedPrices(data.fixedPrices.fixedPrices[0].value)}
								<span className={`${styles.wholesaleValuePerUnits} fw4 ttn-m`}> /un</span>
							</span>
						</div>
						<div className={`${styles.innerSVGButtonContainer} flex items-center justify-center ml3 `}>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className={`${styles.innerSVG} flex`}
							>
								<path
									d="M9 21C10.1046 21 11 20.1046 11 19C11 17.8954 10.1046 17 9 17C7.89543 17 7 17.8954 7 19C7 20.1046 7.89543 21 9 21Z"
									stroke="#848A87"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21Z"
									stroke="#848A87"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M3 3H5L7 15C7.21572 15.6135 7.62494 16.1402 8.16602 16.501C8.7071 16.8617 9.35075 17.0368 10 17H17C17.6493 17.0368 18.2929 16.8617 18.834 16.501C19.3751 16.1402 19.7843 15.6135 20 15L21 8H5.8"
									stroke="#848A87"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
					</div>
				)

				setNewStateText(Object(newDinamicTextButtonAddInner))
			}
		}
	}, [data, toFixedPrices])

	return (
		<div className={`${handles.containerWholesalePrice} flex pv4`}>
			{data?.fixedPrices.fixedPrices[0] && (
				<div className={`${handles.blockUnitsPrice} flex w-100 items-center justify-center`}>
					<div className={`${handles.quantityPriceContainer} flex flex-row w-100`}>
						<div className={`${handles.containerWholesaleButton} flex items-center justify-center w-100`}>
							{data.fixedPrices?.fixedPrices[0]?.minQuantity &&
								data.fixedPrices?.fixedPrices[0]?.minQuantity > validateQuantityOrderForm[0]?.quantity && (
									<ExtensionPoint id="add-to-cart-button" skuItems={skuItems} text={newStateText} />
								)}
							{data.fixedPrices?.fixedPrices[0]?.minQuantity &&
								data.fixedPrices?.fixedPrices[0]?.minQuantity <= validateQuantityOrderForm[0]?.quantity && (
									<div className={`${handles.wholesaleInformations} flex flex-row ph4 pv3 w-100 justify-around ttn`}>
										<div className={`${handles.wholesaleInformationsChecked} flex flex-column`}>
											<span className={`${handles.quantityPriceText} flex flex-row`}>
												A partir de{' '}
												<span className={`${handles.wholesaleMinQtyAndUnit} fw7 ml2`}>
													{data.fixedPrices.fixedPrices[0].minQuantity} un:
												</span>
											</span>
											<span className={`${handles.unitPrice} fw7 nowrap`}>
												R$ {toFixedPrices(data.fixedPrices.fixedPrices[0].value)}{' '}
												<span className={`${handles.wholesaleValuePerUnits} fw4 `}> /un</span>
											</span>
										</div>
										<span className={`${handles.wholePriceActiveCheckMark} flex items-center justify-center ml3`}>
											<svg
												width="17"
												height="12"
												viewBox="0 0 17 12"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												className={`${handles.svgCheckMark}`}
											>
												<path
													d="M1 6L6 11L16 1"
													stroke="#00AC5A"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</span>
									</div>
								)}
							{!validateQuantityOrderForm[0]?.quantity && (
								<ExtensionPoint id="add-to-cart-button" skuItems={skuItems} text={newStateText} />
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export { FixedPrices }
