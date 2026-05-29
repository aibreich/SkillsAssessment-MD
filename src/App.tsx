import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CatalogPage } from './pages/CatalogPage'
import './App.css'

const CartPage = lazy(() =>
  import('./pages/CartPage').then((module) => ({ default: module.CartPage })),
)

function App() {
  return (
    <Suspense
      fallback={
        <div className="app">
          <main className="app-main">
            <p className="visually-hidden" role="status">
              Loading page…
            </p>
          </main>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
