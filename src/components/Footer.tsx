const FOOTER_LINKS = [
  'Privacy Policy',
  'Terms of Service',
  'Contact Us',
  'Store Locator',
] as const

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__logo">MAYBELLINE</span>
          <p className="site-footer__copyright">
            © 2026 Maybelline New York. All rights reserved.
          </p>
        </div>
        <ul className="site-footer__links" aria-label="Footer navigation">
          {FOOTER_LINKS.map((label) => (
            <li key={label}>
              <span className="site-footer__link">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
