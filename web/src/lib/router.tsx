import { useEffect, useState, type ReactNode } from 'react'
import { readHash, type RoutePath } from './router-core'

export { ROUTES, readHash, type RoutePath } from './router-core'

export function useRoute(): RoutePath {
  const [route, setRoute] = useState<RoutePath>(() =>
    readHash(typeof window === 'undefined' ? '' : window.location.hash),
  )
  useEffect(() => {
    const onChange = () => setRoute(readHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function navigate(path: RoutePath) {
  window.location.hash = path
}

export function Link({
  to,
  className,
  children,
  ...rest
}: { to: RoutePath; className?: string; children: ReactNode } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>) {
  return (
    <a href={`#${to}`} className={className} {...rest}>
      {children}
    </a>
  )
}
