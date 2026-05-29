import { useEffect, useMemo, useState } from 'react'
import { normalizeImageUrl } from '../utils/imageUrl'

interface ProductImageProps {
  src: string | null
  alt: string
  className?: string
  priority?: boolean
}

const FALLBACK_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23efeded' width='400' height='400'/%3E%3Ctext fill='%23837373' font-family='Inter,sans-serif' font-size='16' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3ENo image%3C/text%3E%3C/svg%3E"

export function ProductImage({
  src,
  alt,
  className = '',
  priority = false,
}: ProductImageProps) {
  const normalizedSrc = useMemo(() => normalizeImageUrl(src), [src])
  const [imgSrc, setImgSrc] = useState(normalizedSrc || FALLBACK_SRC)

  useEffect(() => {
    setImgSrc(normalizedSrc || FALLBACK_SRC)
  }, [normalizedSrc])

  const handleError = () => {
    setImgSrc(FALLBACK_SRC)
  }

  return (
    <img
      className={`product-image ${className}`.trim()}
      src={imgSrc}
      alt={alt}
      width={400}
      height={400}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      onError={handleError}
    />
  )
}
