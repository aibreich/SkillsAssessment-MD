import { RetryIcon, WarningIcon } from './icons/Icons'

interface ErrorStateProps {
  message: string
  onRetry: () => void
  isRetrying?: boolean
}

export function ErrorState({ message, onRetry, isRetrying = false }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icon-wrap">
        <WarningIcon />
      </div>
      <h2 className="error-state__title">Couldn&apos;t load products</h2>
      <p className="error-state__message">
        Something went wrong while loading the catalog. Please check your connection or try again.
      </p>
      {message && (
        <p className="error-state__detail">{message}</p>
      )}
      <button
        type="button"
        className="btn btn--outline btn--lg error-state__retry"
        onClick={onRetry}
        disabled={isRetrying}
        aria-busy={isRetrying}
      >
        <RetryIcon />
        {isRetrying ? 'Retrying…' : 'Retry'}
      </button>
    </div>
  )
}
