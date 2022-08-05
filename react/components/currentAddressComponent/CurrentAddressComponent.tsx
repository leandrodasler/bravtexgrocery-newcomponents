import React from 'react'
import './CurrentAddressComponent.css'
import { useCssHandles } from 'vtex.css-handles'

const pin = require('./pin.svg') as string

const CSS_HANDLES = [
  'addressComponent',
  'pinIcon',
  'addressComponentInfo',
  'addressComponentTitle',
  'currentAddress',
]

function getBodySession(e: string | null) {
  const t = { public: { country: { value: 'BRA' }, postalCode: { value: e } } }
  return JSON.stringify(t)
}

function setSession(e: string | null) {
  const t = new Headers()
  t.append('Content-Type', 'application/json')
  const n = getBodySession(e)
  return fetch('/api/sessions', {
    headers: t,
    body: n,
    method: 'POST',
    credentials: 'same-origin',
  })
}
async function getAddress(e: string | null) {
  const t = await fetch(`/api/checkout/pub/postal-code/BRA/${e}`, {
    credentials: 'same-origin',
  })
  return await t.json()
}
function setShippingData(e: string | null, t: any) {
  const n = new Headers()
  n.append('Content-Type', 'application/json')
  return fetch(`/api/checkout/pub/orderForm/${e}/attachments/shippingData`, {
    headers: n,
    body: JSON.stringify(t),
    method: 'POST',
    credentials: 'same-origin',
  })
}
async function getOrderFormId() {
  const e = await fetch('/api/checkout/pub/orderForm', {
    credentials: 'same-origin',
  })
  return (await e.json()).orderFormId
}
async function setAddress(e: string | null) {
  let t: any
  ;(t = await getAddress(e)),
    setShippingData(await getOrderFormId(), { address: t })
}

const CurrentAddressComponent = () => {
  const [localidade, setLocalidade] = React.useState('')
  const handles = useCssHandles(CSS_HANDLES)

  React.useEffect(() => {
    const cep = localStorage.getItem('CEP')

    fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      method: 'GET',
      mode: 'cors',
      cache: 'default',
    })
      .then(response => response.json())
      .then(data => {
        if (data.erro) {
          setLocalidade('CEP inválido, clique para alterar.')
        } else {
          setLocalidade(data.localidade + ' - ' + data.uf)
          setSession(cep).then(() => setAddress(cep))
        }
      })
      .catch(() => setLocalidade(''))
  }, [])

  return (
    <>
      <div className={`${handles.addressComponent}`}>
        <img
          className={`${handles.pinIcon}`}
          src={pin}
          alt="Ícone de Localização"
        />
        <div className={`${handles.addressComponentInfo}`}>
          <span className={`${handles.addressComponentTitle}`}>
            Enviar para:{' '}
          </span>
          <span className={`${handles.currentAddress}`}>
            {localidade ? localidade : 'Clique para inserir seu CEP'}
          </span>
        </div>
      </div>
    </>
  )
}

export default CurrentAddressComponent
