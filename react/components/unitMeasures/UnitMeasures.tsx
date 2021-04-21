// import { ProductContext } from 'vtex.product-context'
import React, { useEffect, useMemo, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import type { ProductTypes } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { IconPackage, IconBox } from '@tabler/icons'

import { mapCatalogItemToCart } from '../fixedPrices/modules/catalogItemToCart'
import styles from './UnitMeasures.css'

interface Product {
	productId: string
}

const CSS_HANDLES = [
	'containerUnitMeasurePrice',
	'contentUnitMeasure',
	'unitMeasure',
	'unitMeasureInformations',
	'unitMeasureMinQtyAndUnit',
	'unitMeasureTxt',
	'unitMeasureButtonContent',
	'contentSVGUnitMeasure',
	'contentDinamicUnitMeasureText',
	'unitDinamicTextInfo',
	'unitDinamicTextInfoValue',
	'customSVGBox',
	'customSVGPackage',
	'unitStaticText',
]

const UnitMeasures = () => {
	const handles = useCssHandles(CSS_HANDLES)
	const orderForm = useOrderForm()
	const productContextValue = useProduct()
	const product = productContextValue?.product
	const selectedItem = productContextValue?.selectedItem
	const assemblyOptions = productContextValue?.assemblyOptions
	const seller = productContextValue?.selectedItem?.sellers[0] as ProductTypes.Seller
	const selectedQuantity = productContextValue?.selectedQuantity != null ? productContextValue.selectedQuantity : 1
	const [newStateFD, setNewStateFD] = useState()

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

	const mapUnitMeasureName = productContextValue?.product?.properties.map((item) => {
		if (item.name === 'FD') {
			return 'fardo'
		}

		if (item.name === 'CX') {
			return 'caixa'
		}

		return ''
	})

	const validateQuantityOrderForm = orderForm?.orderForm?.items.filter(
		(item: Product) => item.productId === product?.productId
	)

	const mapUnitMeasureQtyValueCardV2 = productContextValue?.product?.properties?.[0]?.values

	useEffect(() => {
		if (productContextValue?.product?.properties[0]?.values[0]) {
			skuItems[0].quantity = Number(mapUnitMeasureQtyValueCardV2)
		}
	}, [validateQuantityOrderForm, skuItems, productContextValue, mapUnitMeasureQtyValueCardV2])
	useEffect(() => {
		const filterFDItems = productContextValue?.product?.properties.filter((item) => item.name === 'FD')
		const filterCXItems = productContextValue?.product?.properties.filter((item) => item.name === 'CX')

		if (productContextValue?.product?.properties[0]?.name) {
			if (filterFDItems?.length) {
				const customTextFD = (
					<div className={`${styles.contentUnitMeasure} flex items-center justify-center flex-column`}>
						<IconPackage
							size={24}
							color="#00AC5A"
							stroke={2}
							strokeLinejoin="miter"
							className={`${styles.customSVGPackage}`}
						/>
						<span className={`${styles.unitMeasureButtonContent} fw7 `}>
							+{Number(mapUnitMeasureQtyValueCardV2)} unidades
						</span>
					</div>
				)

				setNewStateFD(Object(customTextFD))
			}

			if (filterCXItems?.length) {
				const customTextCX = (
					<div className={`${styles.contentUnitMeasure} flex items-center justify-center flex-column`}>
						<IconBox size={24} color="#00AC5A" stroke={2} strokeLinejoin="miter" className={`${styles.customSVGBox}`} />
						<span className={`${styles.unitMeasureButtonContent} fw7 `}>
							+{Number(mapUnitMeasureQtyValueCardV2)} unidades
						</span>
					</div>
				)

				setNewStateFD(Object(customTextCX))
			}
		}
	}, [productContextValue, mapUnitMeasureQtyValueCardV2])
	const unitDinamicTextInfo = `${Number(mapUnitMeasureQtyValueCardV2)}`

	return (
		<div>
			{mapUnitMeasureQtyValueCardV2 && Number(mapUnitMeasureQtyValueCardV2) > 1 && (
				<div className={`${handles.containerUnitMeasurePrice} flex pa5 items-center justify-center`}>
					<div className={`${handles.contentSVGUnitMeasure} flex`}>
						<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clipPath="url(#clip0)">
								<path d="M27.2354 2.58746L0 10.6701L12.7647 18.7529L40 10.6701L27.2354 2.58746Z" fill="#FFB655" />
								<path d="M12.7647 39.9997L0 31.917V10.6691L12.7647 18.7519V39.9997Z" fill="#FFB655" />
								<path d="M12.7656 39.9997L40.001 31.917V10.6691L12.7656 18.7519V39.9997Z" fill="#FFCE8E" />
								<path d="M23.6171 11.6482L10.8524 3.56543L0 10.6689L12.7647 18.7517L23.6171 11.6482Z" fill="#FFE7C6" />
								<path d="M27.079 8.08266L14.3145 0L27.2353 2.5868L40 10.6695L27.079 8.08266Z" fill="#FFE7C6" />
								<path d="M16.1719 35.4707L36.5934 29.3937V23.5036L16.1719 29.5805V35.4707Z" fill="#00AC5A" />
								<path
									d="M22.8702 29.1002C22.5369 29.1002 22.2666 29.3705 22.2666 29.7038V31.4143C22.2666 31.7477 22.5369 32.018 22.8702 32.018C23.2036 32.018 23.4738 31.7477 23.4738 31.4143V29.7038C23.4738 29.3705 23.2036 29.1002 22.8702 29.1002Z"
									fill="white"
								/>
								<path
									d="M30.8819 26.6452C30.5486 26.6452 30.2783 26.9155 30.2783 27.2488V28.9594C30.2783 29.2928 30.5486 29.563 30.8819 29.563C31.2153 29.563 31.4856 29.2928 31.4856 28.9594V27.2488C31.4856 26.9155 31.2153 26.6452 30.8819 26.6452Z"
									fill="white"
								/>
								<path
									d="M32.6632 26.1618C32.3298 26.1618 32.0596 26.4321 32.0596 26.7654V28.476C32.0596 28.8094 32.3298 29.0796 32.6632 29.0796C32.9966 29.0796 33.2668 28.8094 33.2668 28.476V26.7654C33.2668 26.4321 32.9966 26.1618 32.6632 26.1618Z"
									fill="white"
								/>
								<path
									d="M34.4444 25.6796C34.1111 25.6796 33.8408 25.9499 33.8408 26.2832V27.9938C33.8408 28.3272 34.1111 28.5975 34.4444 28.5975C34.7778 28.5975 35.0481 28.3272 35.0481 27.9938V26.2832C35.0481 25.9499 34.7778 25.6796 34.4444 25.6796Z"
									fill="white"
								/>
								<path
									d="M18.336 30.4499C18.0027 30.4499 17.7324 30.7202 17.7324 31.0535V32.764C17.7324 33.0974 18.0027 33.3676 18.336 33.3676C18.6694 33.3676 18.9397 33.0974 18.9397 32.764V31.0535C18.9397 30.7202 18.6694 30.4499 18.336 30.4499Z"
									fill="white"
								/>
								<path
									d="M20.0802 30.0204C19.7468 30.0204 19.4766 30.2906 19.4766 30.624V32.3345C19.4766 32.6679 19.7468 32.9381 20.0802 32.9381C20.4135 32.9381 20.6838 32.6679 20.6838 32.3345V30.624C20.6838 30.2906 20.4135 30.0204 20.0802 30.0204Z"
									fill="white"
								/>
								<path
									d="M26.0235 28.1256C25.6902 28.1256 25.4199 28.3959 25.4199 28.7292V30.4397C25.4199 30.7731 25.6902 31.0434 26.0235 31.0434C26.3569 31.0434 26.6272 30.7731 26.6272 30.4397V28.7292C26.6272 28.3959 26.3569 28.1256 26.0235 28.1256Z"
									fill="white"
								/>
								<path
									d="M27.7296 27.6887C27.3962 27.6887 27.126 27.959 27.126 28.2923V30.0028C27.126 30.3362 27.3962 30.6065 27.7296 30.6065C28.063 30.6065 28.3332 30.3362 28.3332 30.0028V28.2923C28.3332 27.959 28.063 27.6887 27.7296 27.6887Z"
									fill="white"
								/>
							</g>
							<defs>
								<clipPath id="clip0">
									<rect width="40" height="40" fill="white" />
								</clipPath>
							</defs>
						</svg>
					</div>
					<div className={`${handles.contentDinamicUnitMeasureText} flex flex-column ph5`}>
						<strong className={`${handles.unitMeasureTxt} flex flex-column w-100 fw7 nowrap`}>
							Precisa de uma quantidade maior?
						</strong>
						<span className={`${handles.unitDinamicTextInfo} fw4`}>
							<span className={`${handles.unitDinamicTextInfoValue} fw7`}>
								{unitDinamicTextInfo} unidades <span className={`${handles.unitStaticText} fw4`}> correspondem a</span>{' '}
								<span className={`${handles.unitDinamicTextInfoValue} fw7`}>1 {mapUnitMeasureName}.</span>
							</span>{' '}
							<br />
							Adicione ao carrinho com apenas um clique!
						</span>
					</div>
					<div className={`${handles.contentUnitMeasure} flex items-center justify-center flex-column`}>
						<div className={`${handles.unitMeasureInformations} flex flex-column w-100 h-100`}>
							<div className={`${handles.unitMeasureButtonContent} fw7 `}>
								<ExtensionPoint id="add-to-cart-button" skuItems={skuItems} text={newStateFD} />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default UnitMeasures
