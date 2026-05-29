import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CatalogToolbar } from '../components/CatalogToolbar'
import { ErrorState } from '../components/ErrorState'
import { FilterPanel } from '../components/FilterPanel'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { LoadingState } from '../components/LoadingState'
import { PaginationControls } from '../components/PaginationControls'
import { ProductGrid } from '../components/ProductGrid'
import { ProductModal } from '../components/ProductModal'
import { SortSelect } from '../components/SortSelect'
import { ItemsPerPageSelect } from '../components/ItemsPerPageSelect'
import { APP_SHELL_ID } from '../hooks/useBackgroundAriaHidden'
import { getCatalogDocumentTitle, useDocumentTitle } from '../hooks/useDocumentTitle'
import { useProducts } from '../hooks/useProducts'
import type { FilterState, Product, SortOption } from '../types/product'
import { DEFAULT_FILTERS } from '../types/product'
import { filterProducts, getActiveFilterChips } from '../utils/filterProducts'
import {
  filterProductsByArea,
  getNavAreaIntro,
  NAV_AREAS,
  type NavArea,
} from '../utils/navAreas'
import { formatProductRange, getProductRange } from '../utils/productRange'
import { scrollToElement } from '../utils/scroll'
import { sortProducts } from '../utils/sortProducts'

function getResultsAnnouncement(
  rangeStart: number,
  rangeEnd: number,
  resultCount: number,
  currentPage: number,
  totalPages: number,
): string {
  if (resultCount === 0) return 'No products match your filters.'
  const range = formatProductRange(rangeStart, rangeEnd, resultCount)
  if (totalPages <= 1) return range
  return `${range}, page ${currentPage} of ${totalPages}`
}

export function CatalogPage() {
  const { products, loading, error, retry, isRetrying } = useProducts()
  const location = useLocation()

  const [activeArea, setActiveArea] = useState<NavArea>('All')
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortOption>('featured')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(24)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const productsRef = useRef<HTMLElement>(null)
  const modalTriggerRef = useRef<HTMLButtonElement | null>(null)
  const filterTriggerRef = useRef<HTMLButtonElement | null>(null)
  const isInitialFilters = useRef(true)
  const isInitialPage = useRef(true)

  useDocumentTitle(getCatalogDocumentTitle(activeArea))

  const areaProducts = useMemo(
    () => filterProductsByArea(products, activeArea),
    [products, activeArea],
  )

  const filteredProducts = useMemo(
    () => filterProducts(areaProducts, filters),
    [areaProducts, filters],
  )

  const intro = getNavAreaIntro(activeArea)

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sort),
    [filteredProducts, sort],
  )

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage)),
    [sortedProducts.length, itemsPerPage],
  )

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedProducts.slice(start, start + itemsPerPage)
  }, [sortedProducts, currentPage, itemsPerPage])

  const { start: rangeStart, end: rangeEnd } = useMemo(
    () => getProductRange(sortedProducts.length, currentPage, itemsPerPage),
    [sortedProducts.length, currentPage, itemsPerPage],
  )

  const hasActiveFilters = useMemo(
    () => getActiveFilterChips(filters).length > 0,
    [filters],
  )

  const resultsAnnouncement = useMemo(
    () =>
      getResultsAnnouncement(
        rangeStart,
        rangeEnd,
        sortedProducts.length,
        currentPage,
        totalPages,
      ),
    [rangeStart, rangeEnd, sortedProducts.length, currentPage, totalPages],
  )

  useEffect(() => {
    const area = (location.state as { area?: NavArea } | null)?.area
    if (area && NAV_AREAS.includes(area)) {
      setActiveArea(area)
    }
  }, [location.state])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sort, itemsPerPage, activeArea])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    if (isInitialFilters.current) {
      isInitialFilters.current = false
      return
    }

    const productsSection = productsRef.current
    if (!productsSection) return

    const productsTop =
      productsSection.getBoundingClientRect().top + window.scrollY
    const headerEl = document.querySelector('.site-header')
    const headerHeight = headerEl?.getBoundingClientRect().height ?? 65

    if (window.scrollY > productsTop - headerHeight) {
      scrollToElement(productsSection)
    }
  }, [filters])

  useEffect(() => {
    if (isInitialPage.current) {
      isInitialPage.current = false
      return
    }

    const productsSection = productsRef.current
    if (!productsSection) return

    scrollToElement(productsSection)
  }, [currentPage])

  useEffect(() => {
    if (!mobileFiltersOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileFiltersOpen])

  const handleRemoveFilter = useCallback(
    (group: keyof FilterState, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [group]: prev[group].filter((v) => v !== value),
      }))
    },
    [],
  )

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const handleViewMore = useCallback(
    (product: Product, trigger: HTMLButtonElement) => {
      modalTriggerRef.current = trigger
      setSelectedProduct(product)
    },
    [],
  )

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null)
    const trigger = modalTriggerRef.current
    modalTriggerRef.current = null
    requestAnimationFrame(() => trigger?.focus())
  }, [])

  const handleOpenMobileFilters = useCallback((trigger: HTMLButtonElement) => {
    filterTriggerRef.current = trigger
    setMobileFiltersOpen(true)
  }, [])

  const handleCloseMobileFilters = useCallback(() => {
    setMobileFiltersOpen(false)
    requestAnimationFrame(() => filterTriggerRef.current?.focus())
  }, [])

  return (
    <div className="app">
      <div id={APP_SHELL_ID}>
        <Header activeArea={activeArea} onAreaChange={setActiveArea} />

        <main id="main-content" className="app-main">
          <section className="intro">
            <h1 className="intro__title">{intro.title}</h1>
            <p className="intro__subtitle">{intro.subtitle}</p>
          </section>

          {loading && !isRetrying && (
            <div className="catalog-layout catalog-layout--loading">
              <aside className="filter-panel filter-panel--sidebar filter-panel--skeleton" aria-hidden="true">
                <div className="skeleton-line skeleton-line--lg" />
                <div className="skeleton-line skeleton-line--md" />
                <div className="skeleton-line skeleton-line--md" />
              </aside>
              <section className="catalog-content">
                <LoadingState />
              </section>
            </div>
          )}

          {error && products.length === 0 && (
            <ErrorState message={error} onRetry={retry} isRetrying={isRetrying} />
          )}

          {(products.length > 0 || (!loading && !isRetrying && !error)) && (
            <div className="catalog-layout">
              <FilterPanel
                products={areaProducts}
                filters={filters}
                onChange={setFilters}
                variant="sidebar"
              />

              <section
                ref={productsRef}
                className="catalog-content"
                aria-label="Product results"
              >
                <div
                  className="visually-hidden"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {resultsAnnouncement}
                </div>

                <CatalogToolbar
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  resultCount={sortedProducts.length}
                  filters={filters}
                  sort={sort}
                  itemsPerPage={itemsPerPage}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearFilters}
                  onSortChange={setSort}
                  onItemsPerPageChange={setItemsPerPage}
                  onOpenMobileFilters={handleOpenMobileFilters}
                />

                <ProductGrid
                  products={paginatedProducts}
                  hasActiveFilters={hasActiveFilters}
                  activeArea={activeArea}
                  onViewMore={handleViewMore}
                  onClearFilters={handleClearFilters}
                  onBrowseAll={() => setActiveArea('All')}
                />

                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={sortedProducts.length}
                  onPageChange={setCurrentPage}
                />
              </section>
            </div>
          )}
        </main>

        <Footer />
      </div>

      <FilterPanel
        products={areaProducts}
        filters={filters}
        onChange={setFilters}
        variant="sheet"
        isOpen={mobileFiltersOpen}
        onClose={handleCloseMobileFilters}
        onApply={handleCloseMobileFilters}
        resultCount={sortedProducts.length}
        sortControl={
          <SortSelect value={sort} onChange={setSort} />
        }
        itemsPerPageControl={
          <ItemsPerPageSelect
            value={itemsPerPage}
            onChange={setItemsPerPage}
          />
        }
      />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  )
}
