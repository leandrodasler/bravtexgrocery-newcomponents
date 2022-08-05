import React, { useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { ImageList } from 'vtex.store-image'
import { IMAGE_LIST_SCHEMA } from './schema'
import { Spinner } from 'vtex.styleguide'
import './RegionBanner.css'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['bannersLoading']

interface Link {
  url: string
  attributeNofollow: boolean
  attributeTitle?: string
  openNewTab?: boolean
  newTab?: boolean
}

export type ImagesSchema = Array<{
  image: string
  mobileImage: string
  link?: Link
  title?: string
  franchises?: string
  description: string
  experimentalPreventLayoutShift?: boolean
  width?: number | string
  analyticsProperties?: 'none' | 'provide'
  promotionId?: string
  promotionName?: string
  promotionPosition?: string
}>

export interface ImageListProps {
  images: ImagesSchema | null
  height?: number
  preload?: boolean
}

const RegionBanner = ({
  images,
  height = 420,
  children,
  preload,
}: PropsWithChildren<ImageListProps>) => {
  const [filteredImages, setFilteredImages] = useState<ImagesSchema | null>(
    null
  )
  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    const regionSelected = JSON.parse(
      localStorage.getItem('region-selected') as string
    )
    const country = regionSelected?.country
    const postalCode = regionSelected?.postalCode
    //SP = 04538132
    //RJ = 22081050

    fetch('/api/sessions', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        public: {
          country: { value: country },
          postalCode: { value: postalCode },
        },
      }),
      method: 'POST',
      credentials: 'same-origin',
    })
      .then(res => res.json())
      .then(res => {
        const { regionId } = JSON.parse(atob(res.segmentToken))
        const selectedFranchise = atob(regionId).slice(3)
        setFilteredImages(
          images
            ? images.filter(image => {
                const franchises =
                  image.franchises && !/^\s*$/.test(image.franchises)
                    ? image.franchises?.trim().split(/\s*,\s*/)
                    : null
                if (!franchises) {
                  return true
                }
                return franchises?.includes(selectedFranchise)
              })
            : null
        )
      })
  }, [])

  if (!filteredImages) {
    return (
      <div className={handles.bannersLoading}>
        <Spinner />
      </div>
    )
  }

  return (
    <ImageList
      images={filteredImages}
      height={height}
      children={children}
      preload={preload}
    />
  )
}

RegionBanner.schema = IMAGE_LIST_SCHEMA

export default RegionBanner
