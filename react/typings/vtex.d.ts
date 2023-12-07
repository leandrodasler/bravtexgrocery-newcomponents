declare module 'vtex.store-image/ImageList'
declare module 'vtex.styleguide'
declare module 'vtex.my-account-commons'
declare module 'vtex.my-account-commons/Router'
declare module 'vtex.pixel-manager'
declare module 'vtex.product-summary'
declare module 'vtex.order-manager/OrderForm' {
  export const useOrderForm: () => {
    orderForm: {
      items: [{ id: string; uniqueId: string; quantity: number }]
    }
  }
}
declare module 'vtex.order-items/OrderItems'
declare module 'vtex.product-context/ProductDispatchContext'
