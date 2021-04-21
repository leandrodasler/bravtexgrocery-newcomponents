import React, { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useMutation, useLazyQuery, useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { Checkbox } from 'vtex.styleguide'
import './RenderOptIn.css'

import PATCH_MDFIELDS from './gql/PATCH_MDFIELDS.gql'
import GET_DOCUMENT from '../../gql/GET_DOCUMENT.gql'
import PROFILE from './gql/PROFILE.gql'

const CSS_HANDLES = [
	'wppContainer',
	'smsContainer',
	'emailContainer',
	'titleComponent',
	'textComponentOffer',
	'offerContainer',
]

const RenderOptIn = () => {
	const { account } = useRuntime()

	const handles = useCssHandles(CSS_HANDLES)

	const [isWppOptIn, setIsWppOptIn] = useState(false)
	const [isSmsOptIn, setIsSmsOptIn] = useState(false)
	const [isNewsletterOptIn, setIsNewsletterOptIn] = useState(false)
	const [documentId, setDocumentId] = useState(String)

	const [patchOptin] = useMutation(PATCH_MDFIELDS)
	const [getId, { data: getSession }] = useLazyQuery(PROFILE)
	const userId = getSession?.getSession.adminUserId

	useEffect(() => {
		getId()
	}, [getId])

	const { data } = useQuery(GET_DOCUMENT, {
		variables: {
			acronym: 'CL',
			fields: ['isWhatsappOptIn', 'isNewsletterOptIn', 'isSmsOptIn'],
			where: `userId=${userId}`,
			account,
		},
	})

	useEffect(() => {
		const fildFilter = data?.documents[0]?.fields.map((field) => field.value)

		if (fildFilter) {
			data.documents[0].fields.forEach((field: any) => {
				if (field.key === 'id') {
					setDocumentId(field.value)
				}

				if (field.key === 'isNewsletterOptIn' && field.value === 'true') {
					setIsNewsletterOptIn(!isNewsletterOptIn)
				}

				if (field.key === 'isWhatsappOptIn' && field.value === 'true') {
					setIsWppOptIn(!isWppOptIn)
				}

				if (field.key === 'isSmsOptIn' && field.value === 'true') {
					setIsSmsOptIn(!isSmsOptIn)
				}
			})
		}
	}, [data, isNewsletterOptIn, isWppOptIn, isSmsOptIn])

	const sendWppOptin = (e: any) => {
		patchOptin({
			variables: {
				acronym: 'CL',
				document: {
					fields: [
						{
							key: 'isWhatsappOptIn',
							value: !isWppOptIn,
						},
						{
							key: 'id',
							value: documentId,
						},
					],
				},
				account,
			},
		})
		setIsWppOptIn(!isWppOptIn)
		e.stopPropagation()
	}

	const sendSmsOptin = (e: any) => {
		patchOptin({
			variables: {
				acronym: 'CL',
				document: {
					fields: [
						{
							key: 'isSmsOptIn',
							value: !isSmsOptIn,
						},
						{
							key: 'id',
							value: documentId,
						},
					],
				},
				account,
			},
		})
		setIsSmsOptIn(!isSmsOptIn)
		e.preventDefault()
	}

	const sendNewsletterOptin = (e: any) => {
		patchOptin({
			variables: {
				acronym: 'CL',
				document: {
					fields: [
						{
							key: 'isNewsletterOptIn',
							value: !isNewsletterOptIn,
						},
						{
							key: 'id',
							value: documentId,
						},
					],
				},
				account,
			},
		})
		setIsNewsletterOptIn(!isNewsletterOptIn)
		e.preventDefault()
	}

	return (
		<>
			<label className={handles.wppContainer} htmlFor="isWhatsAppOptIn">
				<Checkbox
					className="flex flex-start"
					id="isWhatsAppOptIn"
					name="isWhatsAppOptIn"
					label="Autorizo receber o status do meu pedido via Whatsapp no telefone acima"
					onChange={sendWppOptin}
					checked={isWppOptIn}
				/>
			</label>
			<div className={handles.offerContainer}>
				<h4 className={handles.titleComponent}>Ofertas</h4>
				<div className={handles.textComponentOffer}>
					Autorizo o uso dos meus dados para recebimento de notificações, dicas, ofertas e promoções do GIGA Atacado com
					base no meu perfil, através de:
				</div>
				<label className={handles.emailContainer} htmlFor="isNewsletterOptIn">
					<Checkbox
						className="flex flex-start"
						id="isNewsletterOptIn"
						name="isNewsletterOptIn"
						label="E-mail"
						onChange={sendNewsletterOptin}
						checked={isNewsletterOptIn}
					/>
				</label>
				<label className={handles.smsContainer} htmlFor="isSmsOptIn">
					<Checkbox
						className="flex flex-start"
						id="isSmsOptIn"
						name="isSmsOptIn"
						label="SMS"
						onChange={sendSmsOptin}
						checked={isSmsOptIn}
					/>
				</label>
			</div>
		</>
	)
}

export default RenderOptIn
