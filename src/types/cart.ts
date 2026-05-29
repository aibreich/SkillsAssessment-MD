export interface CartLine {
  id: string
  productId: number
  name: string
  price: number | null
  imageUrl: string | null
  shadeIndex: number
  shadeLabel: string
  quantity: number
}

export function getCartLineId(productId: number, shadeIndex: number): string {
  return `${productId}-${shadeIndex}`
}
