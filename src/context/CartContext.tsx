import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../types/product'
import { getCartLineId, type CartLine } from '../types/cart'
import { formatColorLabel } from '../utils/formatters'

const STORAGE_KEY = 'meyer-cart'

interface CartContextValue {
  items: CartLine[]
  itemCount: number
  subtotal: number
  addItem: (product: Product, shadeIndex: number) => void
  removeItem: (lineId: string) => void
  updateQuantity: (lineId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function getShadeLabel(product: Product, shadeIndex: number): string {
  const color = product.colors[shadeIndex]
  if (!color) return 'Default'
  return formatColorLabel(color.colour_name) || `Shade ${shadeIndex + 1}`
}

function loadStoredItems(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => loadStoredItems())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: Product, shadeIndex: number) => {
    const lineId = getCartLineId(product.id, shadeIndex)
    const shadeLabel = getShadeLabel(product, shadeIndex)

    setItems((prev) => {
      const existing = prev.find((item) => item.id === lineId)
      if (existing) {
        return prev.map((item) =>
          item.id === lineId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [
        ...prev,
        {
          id: lineId,
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          shadeIndex,
          shadeLabel,
          quantity: 1,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== lineId))
  }, [])

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((item) =>
        item.id === lineId ? { ...item, quantity } : item,
      ),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.price ?? 0) * item.quantity,
        0,
      ),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
