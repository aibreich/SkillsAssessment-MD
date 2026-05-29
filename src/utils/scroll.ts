export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToElement(
  element: HTMLElement,
  options?: { headerOffset?: number; padding?: number },
): void {
  const headerEl = document.querySelector('.site-header')
  const headerHeight =
    options?.headerOffset ?? headerEl?.getBoundingClientRect().height ?? 65
  const scrollPadding = options?.padding ?? 24
  const top = element.getBoundingClientRect().top + window.scrollY

  window.scrollTo({
    top: Math.max(0, top - headerHeight - scrollPadding),
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}
