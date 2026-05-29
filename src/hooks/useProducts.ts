import { useCallback, useEffect, useState } from 'react'
import { fetchProducts } from '../api/products'
import type { Product } from '../types/product'

interface UseProductsResult {
  products: Product[]
  loading: boolean
  error: string | null
  isRetrying: boolean
  retry: () => void
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const load = useCallback(async (signal: AbortSignal, isRetry: boolean) => {
    if (isRetry) {
      setIsRetrying(true)
    } else {
      setLoading(true)
      setError(null)
    }

    try {
      const data = await fetchProducts(signal)
      if (!signal.aborted) {
        setProducts(data)
        setError(null)
      }
    } catch (err) {
      if (signal.aborted) return

      const message =
        err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      if (!isRetry) {
        setProducts([])
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
        setIsRetrying(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal, attempt > 0)
    return () => controller.abort()
  }, [load, attempt])

  const retry = useCallback(() => {
    setAttempt((n) => n + 1)
  }, [])

  return { products, loading, error, isRetrying, retry }
}
