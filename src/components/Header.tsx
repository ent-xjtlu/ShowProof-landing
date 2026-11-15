import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, GitBranch, Menu } from 'lucide-react'
import type { Language, PageCopy } from '../content'
import { Brand, GITHUB_URL } from './Brand'

interface HeaderProps {
  copy: PageCopy
  language: Language
  onSwitchLanguage: () => void
}

export function Header({ copy, language, onSwitchLanguage }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const headerInnerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const header = headerRef.current
    const inner = headerInnerRef.current
    const menu = menuRef.current
    if (!header || !inner || !menu) return

    let frame = 0
    let previousWidth = 0
    let isWide = false
    const supportsPopover = Object.hasOwn(HTMLElement.prototype, 'popover')

    const measure = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const width = inner.clientWidth
        if (!isWide && width < previousWidth) {
          previousWidth = width
          return
        }
        const wasOpen = menu.matches(':is(:popover-open, .\\:popover-open, .fallback-open)')
        inner.classList.add('is-measuring')
        header.classList.add('is-wide')
        const nextWide = inner.scrollWidth <= inner.clientWidth + 1
        header.classList.toggle('is-wide', nextWide)
        if (nextWide) {
          menu.removeAttribute('popover')
          menu.classList.remove('fallback-open')
          setMenuOpen(false)
        } else {
          menu.setAttribute('popover', 'auto')
          if (wasOpen && supportsPopover && !menu.matches(':popover-open')) {
            menu.showPopover()
          }
        }
        isWide = nextWide
        previousWidth = width
        window.requestAnimationFrame(() => inner.classList.remove('is-measuring'))
      })
    }

    const observer = new ResizeObserver(measure)
    observer.observe(inner)
    void document.fonts?.ready.then(measure)
    measure()
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [language])

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return

    const onToggle = (event: Event) => {
      if ('newState' in event) {
        setMenuOpen((event as ToggleEvent).newState === 'open')
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu.classList.contains('fallback-open')) {
        menu.classList.remove('fallback-open')
        setMenuOpen(false)
      }
    }

    menu.addEventListener('toggle', onToggle)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      menu.removeEventListener('toggle', onToggle)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    const links = Array.from(menu.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')).filter(
      (link) => link.getAttribute('href') !== '#demo' || !link.closest('.landing-menu__mobile-cta'),
    )

    const setCurrent = (id: string | null) => {
      for (const link of links) {
        const active = Boolean(id) && link.hash === `#${id}`
        link.classList.toggle('target-current', active)
        link.setAttribute('aria-current', active ? 'true' : 'false')
      }
    }

    const sections = links
      .map((link) => document.querySelector<HTMLElement>(link.hash))
      .filter((el): el is HTMLElement => el !== null)

    let rafId = 0
    const updateActiveSection = () => {
      window.cancelAnimationFrame(rafId)
      rafId = window.requestAnimationFrame(() => {
        const probeY = window.innerHeight * 0.34
        let currentId: string | null = null
        for (const section of sections) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= probeY) {
            currentId = section.id
          }
        }
        setCurrent(currentId)
      })
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection, { passive: true })
    updateActiveSection()
    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [language])

  const toggleMenuFallback = () => {
    if (Object.hasOwn(HTMLElement.prototype, 'popover')) return
    const menu = menuRef.current
    if (!menu) return
    const open = menu.classList.toggle('fallback-open')
    setMenuOpen(open)
  }

  const closeMenu = () => {
    const menu = menuRef.current
    if (!menu) return
    menu.classList.remove('fallback-open')
    setMenuOpen(false)
    if (menu.hasAttribute('popover') && menu.matches(':popover-open')) {
      menu.hidePopover()
    }
  }

  const handleSwitchLanguage = () => {
    onSwitchLanguage()
    closeMenu()
  }

  return (
    <header className="landing-header" ref={headerRef}>
      <div className="landing-header__inner" ref={headerInnerRef}>
        <Brand homeLabel={copy.brandHome} />
        <nav className="landing-nav" aria-label={copy.navLabel}>
          <button
            className="landing-menu-button"
            type="button"
            popoverTarget="landing-menu"
            aria-controls="landing-menu"
            aria-expanded={menuOpen}
            onClick={toggleMenuFallback}
          >
            <Menu size={16} aria-hidden="true" />
            <span>{copy.menu}</span>
          </button>
          <ul className="landing-menu" id="landing-menu" popover="auto" ref={menuRef}>
            {copy.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} aria-current="false" onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
            <li className="landing-menu__language">
              <button
                type="button"
                aria-label={copy.languageLabel}
                aria-pressed={language === 'en'}
                onClick={handleSwitchLanguage}
              >
                {copy.languageLabel}
              </button>
            </li>
            <li className="landing-menu__github">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>
                <GitBranch size={15} aria-hidden="true" /> GitHub / ShowProof
              </a>
            </li>
            <li className="landing-menu__mobile-cta">
              <a href="#demo" onClick={closeMenu}>
                {copy.headerCta} <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </nav>
        <button
          className="landing-language"
          type="button"
          aria-label={copy.languageLabel}
          aria-pressed={language === 'en'}
          onClick={handleSwitchLanguage}
        >
          {copy.languageShort}
        </button>
        <a className="landing-github" href={GITHUB_URL} target="_blank" rel="noreferrer">
          <GitBranch size={16} aria-hidden="true" />
          <span>GitHub / ShowProof</span>
        </a>
        <a className="landing-header__cta" href="#demo">
          {copy.headerCta} <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
      <div className="landing-header__progress" aria-hidden="true" />
    </header>
  )
}
