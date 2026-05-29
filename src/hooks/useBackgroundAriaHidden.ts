import { useEffect } from 'react'

export const APP_SHELL_ID = 'app-shell-content'

export function useBackgroundAriaHidden(isActive: boolean): void {
  useEffect(() => {
    if (!isActive) return

    const shell = document.getElementById(APP_SHELL_ID)
    if (!shell) return

    shell.setAttribute('aria-hidden', 'true')
    return () => {
      shell.removeAttribute('aria-hidden')
    }
  }, [isActive])
}
