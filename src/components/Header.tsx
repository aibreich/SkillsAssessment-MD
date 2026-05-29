import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { NavArea } from '../utils/navAreas'
import { NAV_AREAS } from '../utils/navAreas'
import { useCart } from '../context/CartContext'
import { CartIcon } from './icons/Icons'

interface HeaderProps {
  activeArea?: NavArea
  onAreaChange?: (area: NavArea) => void
}

export function Header({ activeArea, onAreaChange }: HeaderProps) {
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const isCatalogPage = location.pathname === '/'

  const handleAreaClick = (area: NavArea) => {
    if (isCatalogPage && onAreaChange) {
      onAreaChange(area)
      return
    }
    navigate('/', { state: { area } })
  }

  const cartLabel =
    itemCount === 0
      ? 'Shopping cart, empty'
      : `Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`

  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="site-header__inner">
        <div className="site-header__brand">
          <Link to="/" className="site-header__logo" aria-label="Maybelline home">
            MAYBELLINE
          </Link>
        </div>

        <nav className="site-header__nav" aria-label="Main navigation">
          <ul className="site-header__nav-list">
            {NAV_AREAS.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className={`site-header__nav-link${isCatalogPage && item === activeArea ? ' site-header__nav-link--active' : ''}`}
                  aria-current={isCatalogPage && item === activeArea ? 'page' : undefined}
                  onClick={() => handleAreaClick(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className="icon-btn icon-btn--cart"
            aria-label={cartLabel}
            onClick={() => navigate('/cart')}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="icon-btn__badge" aria-hidden="true">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav className="site-header__mobile-nav" aria-label="Product categories">
        <ul className="site-header__mobile-nav-list">
          {NAV_AREAS.map((item) => (
            <li key={item}>
              <button
                type="button"
                className={`site-header__mobile-nav-link${isCatalogPage && item === activeArea ? ' site-header__mobile-nav-link--active' : ''}`}
                aria-current={isCatalogPage && item === activeArea ? 'page' : undefined}
                onClick={() => handleAreaClick(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
