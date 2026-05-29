import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { CartIcon } from '../components/icons/Icons'
import { ProductImage } from '../components/ProductImage'
import { APP_SHELL_ID } from '../hooks/useBackgroundAriaHidden'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatPrice } from '../utils/formatters'

export function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } =
    useCart()

  useDocumentTitle('Shopping Cart | Maybelline Product Catalog')

  return (
    <div className="app">
      <div id={APP_SHELL_ID}>
        <Header />

        <main id="main-content" className="app-main">
        <section className="cart-page">
          <div className="cart-page__header">
            <h1 className="cart-page__title">Shopping Cart</h1>
            {itemCount > 0 && (
              <p className="cart-page__count">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>

          {items.length === 0 ? (
            <div className="cart-empty" role="status">
              <div className="cart-empty__icon-wrap">
                <CartIcon size={32} />
              </div>
              <h2 className="cart-empty__title">Your cart is empty</h2>
              <p className="cart-empty__message">
                Browse the catalog and add products to get started.
              </p>
              <Link to="/" className="btn btn--primary btn--lg">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <ul className="cart-items" aria-label="Cart items">
                {items.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="cart-item__image">
                      <ProductImage src={item.imageUrl} alt={item.name} />
                    </div>

                    <div className="cart-item__details">
                      <h2 className="cart-item__name">{item.name}</h2>
                      <p className="cart-item__shade">{item.shadeLabel}</p>
                      <p className="cart-item__price">{formatPrice(item.price)}</p>
                    </div>

                    <div className="cart-item__actions">
                      <div className="cart-qty" aria-label={`Quantity for ${item.name}`}>
                        <button
                          type="button"
                          className="cart-qty__btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <span className="cart-qty__value" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="cart-qty__btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <p className="cart-item__line-total">
                      {formatPrice((item.price ?? 0) * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <aside className="cart-summary" aria-label="Order summary">
                <h2 className="cart-summary__title">Order Summary</h2>

                <dl className="cart-summary__rows">
                  <div className="cart-summary__row">
                    <dt>Subtotal</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="cart-summary__row">
                    <dt>Shipping</dt>
                    <dd>Calculated at checkout</dd>
                  </div>
                </dl>

                <div className="cart-summary__total">
                  <span>Estimated Total</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                <button type="button" className="btn btn--primary btn--full btn--lg">
                  Proceed to Checkout
                </button>

                <Link to="/" className="btn btn--outline btn--full">
                  Continue Shopping
                </Link>

                <button
                  type="button"
                  className="cart-summary__clear"
                  onClick={clearCart}
                >
                  Clear cart
                </button>
              </aside>
            </div>
          )}
        </section>
      </main>

      <Footer />
      </div>
    </div>
  )
}
