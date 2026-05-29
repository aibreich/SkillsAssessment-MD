import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useBackgroundAriaHidden } from '../hooks/useBackgroundAriaHidden'
import type { Product } from '../types/product'
import {
  formatPrice,
  formatRatingModal,
  getProductTypeLabel,
  formatColorLabel,
} from '../utils/formatters'
import { handleFocusTrap } from '../utils/focusTrap'
import { isBestseller } from '../utils/productBadges'
import { BestsellerBadge } from './BestsellerBadge'
import { CloseIcon, StarIcon } from './icons/Icons'
import { ProductImage } from './ProductImage'

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [selectedShade, setSelectedShade] = useState(0)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useCart()
  const navigate = useNavigate()

  const descriptionId = product.description ? 'modal-description' : undefined

  useBackgroundAriaHidden(true)

  useEffect(() => {
    setSelectedShade(0)
    setJustAdded(false)
  }, [product.id])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (modalRef.current) {
        handleFocusTrap(event, modalRef.current)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const handleAddToCart = () => {
    addItem(product, selectedShade)
    setJustAdded(true)
  }

  const handleViewCart = () => {
    onClose()
    navigate('/cart')
  }

  const categoryLabel = getProductTypeLabel(product.productType).toUpperCase()

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={descriptionId}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close product details"
        >
          <CloseIcon />
        </button>

        <div className="modal__layout">
          <div className="modal__image">
            {isBestseller(product) && <BestsellerBadge />}
            <ProductImage src={product.imageUrl} alt={product.name} />
          </div>

          <div className="modal__content">
            <p className="modal__brand">{product.brand || 'MAYBELLINE'}</p>

            <h2 id="modal-title" className="modal__title">
              {product.name}
            </h2>

            <div className="modal__meta">
              <span className="modal__category">{categoryLabel}</span>
              {product.rating != null && (
                <span className="modal__rating">
                  <StarIcon size={14} />
                  {formatRatingModal(product.rating)}
                </span>
              )}
            </div>

            <p className="modal__price">{formatPrice(product.price)}</p>

            {product.description && (
              <div className="modal__description-block">
                <h3 className="modal__section-title">Description</h3>
                <p id={descriptionId} className="modal__description">
                  {product.description}
                </p>
              </div>
            )}

            {product.colors.length > 0 && (
              <div className="modal__shades">
                <h3 className="modal__section-title">Select Shade</h3>
                <ul className="modal__swatches">
                  {product.colors.map((color, index) => {
                    const shadeLabel =
                      formatColorLabel(color.colour_name) ||
                      `Shade ${index + 1}`

                    return (
                      <li key={`${color.colour_name}-${color.hex_value}`}>
                        <button
                          type="button"
                          className={`modal__swatch-btn${selectedShade === index ? ' modal__swatch-btn--selected' : ''}`}
                          onClick={() => {
                            setSelectedShade(index)
                            setJustAdded(false)
                          }}
                          aria-label={`Select shade ${shadeLabel}`}
                          aria-pressed={selectedShade === index}
                        >
                          <span
                            className="modal__swatch-color"
                            style={{
                              backgroundColor: `#${color.hex_value.replace(/^#/, '')}`,
                            }}
                          />
                        </button>
                        {selectedShade === index && (
                          <span className="modal__swatch-name">
                            {shadeLabel.toUpperCase()}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {(product.productLink || product.websiteLink) && (
              <div className="modal__links">
                {product.productLink && (
                  <a
                    href={product.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--outline btn--full"
                  >
                    View Product
                    <span className="visually-hidden"> (opens in new tab)</span>
                  </a>
                )}
                {product.websiteLink && (
                  <a
                    href={product.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--outline btn--full"
                  >
                    Visit Website
                    <span className="visually-hidden"> (opens in new tab)</span>
                  </a>
                )}
              </div>
            )}

            <div className="modal__actions">
              <div className="visually-hidden" aria-live="polite" aria-atomic="true">
                {justAdded ? `${product.name} added to cart` : ''}
              </div>
              <button
                type="button"
                className="btn btn--primary btn--full btn--lg"
                onClick={handleAddToCart}
              >
                {justAdded ? 'Added to Cart' : 'Add to Cart'}
              </button>
              {justAdded && (
                <button
                  type="button"
                  className="btn btn--outline btn--full btn--lg"
                  onClick={handleViewCart}
                >
                  View Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
