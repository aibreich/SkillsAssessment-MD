import { memo } from 'react'
import type { Product } from '../types/product'
import { formatPrice, formatRatingCompact, formatColorLabel } from '../utils/formatters'
import { isBestseller } from '../utils/productBadges'
import { BestsellerBadge } from './BestsellerBadge'
import { StarIcon } from './icons/Icons'
import { ProductImage } from './ProductImage'

interface ProductCardProps {
  product: Product
  onViewMore: (product: Product, trigger: HTMLButtonElement) => void
  priorityImage?: boolean
}

const PREVIEW_SWATCHES = 4

function getSwatchesAriaLabel(totalColors: number, visibleCount: number): string {
  if (totalColors === 0) return ''
  if (totalColors <= visibleCount) {
    return `${totalColors} ${totalColors === 1 ? 'shade' : 'shades'} available`
  }
  return `${visibleCount} shades shown, ${totalColors} total. View product for all shades.`
}

export const ProductCard = memo(function ProductCard({
  product,
  onViewMore,
  priorityImage = false,
}: ProductCardProps) {
  const visibleColors = product.colors.slice(0, PREVIEW_SWATCHES)
  const extraColors = product.colors.length - PREVIEW_SWATCHES

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        {isBestseller(product) && <BestsellerBadge />}
        <ProductImage src={product.imageUrl} alt={product.name} priority={priorityImage} />
      </div>

      <div className="product-card__body">
        {product.rating != null && (
          <div className="product-card__rating">
            <StarIcon className="product-card__rating-star" />
            <span>{formatRatingCompact(product.rating)}</span>
          </div>
        )}

        <div className="product-card__header">
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__price">{formatPrice(product.price)}</p>
        </div>

        {product.description && (
          <p className="product-card__description">{product.description}</p>
        )}

        {visibleColors.length > 0 && (
          <div
            className="product-card__swatches"
            aria-label={getSwatchesAriaLabel(product.colors.length, visibleColors.length)}
          >
            {visibleColors.map((color) => {
              const shadeLabel = formatColorLabel(color.colour_name)
              return (
                <span
                  key={`${color.colour_name}-${color.hex_value}`}
                  className="product-card__swatch"
                  style={{
                    backgroundColor: `#${color.hex_value.replace(/^#/, '')}`,
                  }}
                  {...(shadeLabel ? { title: shadeLabel } : {})}
                  aria-hidden="true"
                />
              )
            })}
            {extraColors > 0 && (
              <span className="product-card__swatch-more" aria-hidden="true">
                +{extraColors}
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          className="btn btn--outline product-card__cta"
          onClick={(event) => onViewMore(product, event.currentTarget)}
        >
          View More
        </button>
      </div>
    </article>
  )
})
