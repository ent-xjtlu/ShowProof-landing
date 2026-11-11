import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  Building2,
  Check,
  ChevronDown,
  CircleCheck,
  Database,
  FileCheck2,
  FileText,
  GitBranch,
  Globe2,
  LockKeyhole,
  Menu,
  MessageSquareText,
  Play,
  Radar,
  ScanSearch,
  ShieldCheck,
} from 'lucide-react'
import { CONTENT, type Language } from '../content'
import '../landing.css'

const FEATURE_ICONS = [ScanSearch, Building2, BadgeDollarSign, FileCheck2, Radar, MessageSquareText]
const FEATURE_CLASSES = [
  'feature-card--wide',
  'feature-card--tall',
  '',
  '',
  '',
  'feature-card--wide feature-card--copper',
]
const PRIVACY_ICONS = [Database, ShieldCheck, Globe2]
const LANGUAGE_KEY = 'shizheng-language'
const GITHUB_URL = 'https://github.com/ent-xjtlu/ShowProof'

function getInitialLanguage(): Language {
  try {
    return window.localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'zh'
  } catch {
    return 'zh'
  }
}

function ExVisMark() {
  return (
    <svg viewBox="0 0 64 64" focusable="false">
      <path d="M18 5 H40 M59 18 V44 Q59 59 44 59 H20 Q5 59 5 44 V20 Q5 5 20 5" fill="none" stroke="#b5492a" strokeWidth="5" strokeLinecap="butt" strokeLinejoin="round" />
      <path d="M16 25 L45 14.5 L45 18.5 L16 29 Z" fill="#e6b28c" />
      <path d="M20 34 L33.5 28.5 L33.5 50 L20 55.5 Z" fill="#8a2c0f" />
      <path d="M37 27.5 L50 22 L50 43.5 L37 49 Z" fill="#e6b28c" />
      <path d="M53.5 31 L60 28 L60 42 L53.5 45 Z" fill="#c05a30" />
    </svg>
  )
}

function Brand({ homeLabel }: { homeLabel: string }) {
  return (
    <a className="landing-brand" href="#top" aria-label={homeLabel}>
      <span className="landing-brand__mark" aria-hidden="true"><ExVisMark /></span>
      <span className="landing-brand__text">
        <strong>ExVis<span className="landing-brand__zh">展视</span></strong>
        <small>MARKET INTELLIGENCE, VERIFIED.</small>
      </span>
    </a>
  )
}

export function MarketingPage() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)
  const copy = CONTENT[language]
  const headerRef = useRef<HTMLElement>(null)
  const headerInnerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
    document.title = copy.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.meta.description)
    try {
      window.localStorage.setItem(LANGUAGE_KEY, language)
    } catch {
      return
    }
  }, [copy.meta.description, copy.meta.title, language])

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
        } else {
          menu.setAttribute('popover', 'auto')
          if (wasOpen && supportsPopover && !menu.matches(':popover-open')) menu.showPopover()
        }
        isWide = nextWide
        previousWidth = width
        window.requestAnimationFrame(() => inner.classList.remove('is-measuring'))
      })
    }

    const observer = new ResizeObserver(measure)
    observer.observe(inner)
    void document.fonts.ready.then(measure)
    measure()
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [language])

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    const links = Array.from(menu.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
    const setCurrent = (id: string | null) => {
      for (const link of links) {
        const active = link.hash === `#${id}`
        link.classList.toggle('target-current', active)
        link.setAttribute('aria-current', active ? 'true' : 'false')
      }
    }

    if (CSS.supports('scroll-target-group: auto')) {
      const sync = () => {
        const current = menu.querySelector<HTMLAnchorElement>('a:target-current')
        setCurrent(current?.hash.slice(1) ?? null)
      }
      document.addEventListener('scrollend', sync)
      sync()
      return () => document.removeEventListener('scrollend', sync)
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setCurrent(entry.target.id)
      }
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 })
    for (const link of links) {
      const section = document.querySelector(link.hash)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [language])

  const toggleMenuFallback = () => {
    if (Object.hasOwn(HTMLElement.prototype, 'popover')) return
    const menu = menuRef.current
    if (!menu) return
    const open = menu.classList.toggle('fallback-open')
    menu.previousElementSibling?.setAttribute('aria-expanded', String(open))
  }

  const closeMenu = () => {
    const menu = menuRef.current
    if (!menu) return
    menu.classList.remove('fallback-open')
    menu.previousElementSibling?.setAttribute('aria-expanded', 'false')
    if (menu.hasAttribute('popover') && menu.matches(':popover-open')) menu.hidePopover()
  }

  const switchLanguage = () => {
    setLanguage((current) => current === 'zh' ? 'en' : 'zh')
    closeMenu()
  }

  return (
    <div className="landing-page" id="top">
      <a className="landing-skip" href="#main-content">{copy.skip}</a>
      <header className="landing-header" ref={headerRef}>
        <div className="landing-header__inner" ref={headerInnerRef}>
          <Brand homeLabel={copy.brandHome} />
          <nav className="landing-nav" aria-label={copy.navLabel}>
            <button
              className="landing-menu-button"
              type="button"
              popoverTarget="landing-menu"
              aria-controls="landing-menu"
              aria-expanded="false"
              onClick={toggleMenuFallback}
            >
              <Menu size={16} aria-hidden="true" />
              <span>{copy.menu}</span>
            </button>
            <ul className="landing-menu" id="landing-menu" popover="auto" ref={menuRef}>
              {copy.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} aria-current="false" onClick={closeMenu}>{item.label}</a>
                </li>
              ))}
              <li className="landing-menu__language"><button type="button" aria-label={copy.languageLabel} aria-pressed={language === 'en'} onClick={switchLanguage}>{copy.languageLabel}</button></li>
              <li className="landing-menu__github"><a href={GITHUB_URL} target="_blank" rel="noreferrer" onClick={closeMenu}><GitBranch size={15} aria-hidden="true" /> GitHub / ShowProof</a></li>
              <li className="landing-menu__mobile-cta"><a href="#demo" onClick={closeMenu}>{copy.headerCta} <ArrowUpRight size={15} aria-hidden="true" /></a></li>
            </ul>
          </nav>
          <button className="landing-language" type="button" aria-label={copy.languageLabel} aria-pressed={language === 'en'} onClick={switchLanguage}>{copy.languageShort}</button>
          <a className="landing-github" href={GITHUB_URL} target="_blank" rel="noreferrer"><GitBranch size={16} aria-hidden="true" /><span>GitHub / ShowProof</span></a>
          <a className="landing-header__cta" href="#demo">{copy.headerCta} <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </header>

      <main id="main-content">
        <section className="landing-hero" aria-labelledby="hero-title">
          <div className="landing-hero__grid" aria-hidden="true" />
          <div className="landing-shell landing-hero__inner">
            <div className="landing-hero__copy">
              <p className="landing-eyebrow"><span /> {copy.hero.eyebrow}</p>
              <h1 id="hero-title">{copy.hero.titleA}<br />{copy.hero.titleB}<br className="landing-mobile-break" /><em>{copy.hero.titleHighlight}</em>{copy.hero.titleC}</h1>
              <p className="landing-hero__lead">{copy.hero.lead}<strong>{copy.hero.leadStrong}</strong>{language === 'zh' ? '。' : '.'}</p>
              <div className="landing-hero__actions">
                <a className="landing-button landing-button--primary" href="#features">{copy.hero.primary} <ArrowRight size={18} aria-hidden="true" /></a>
                <a className="landing-button landing-button--text" href="#demo"><span className="landing-play"><Play size={13} fill="currentColor" aria-hidden="true" /></span> {copy.hero.watch}</a>
              </div>
              <ul className="landing-hero__proof" aria-label={language === 'zh' ? '产品特点' : 'Product highlights'}>
                {copy.hero.proofs.map((proof) => <li key={proof}><Check size={14} aria-hidden="true" /> {proof}</li>)}
              </ul>
            </div>

            <div className="landing-hero__visual" aria-label={copy.report.aria}>
              <div className="hero-report">
                <div className="hero-report__bar">
                  <div className="hero-report__mini-brand"><span className="landing-brand__mark" aria-hidden="true"><ExVisMark /></span><b>ExVis<span className="landing-brand__zh">展视</span></b><span>/ EXHIBITION REPORT</span></div>
                  <span className="hero-report__status"><i /> {copy.report.status}</span>
                </div>
                <div className="hero-report__body">
                  <div className="hero-report__meta"><span>{copy.report.number}</span><span>{copy.report.sample}</span></div>
                  <div className="hero-report__title-row">
                    <div>
                      <p>{copy.report.industry}</p>
                      <h2>{copy.report.name}</h2>
                      <span>{copy.report.date}</span>
                    </div>
                    <div className="hero-score"><strong>73</strong><span>{copy.report.score}</span></div>
                  </div>
                  <div className="hero-verdict"><CircleCheck size={17} aria-hidden="true" /><strong>{copy.report.verdict}</strong><span>{copy.report.verdictNote}</span></div>
                  <div className="hero-report__stats">
                    {copy.report.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
                  </div>
                  <div className="hero-report__section-head"><span>{copy.report.companiesTitle}</span><span>{copy.report.relationTitle}</span></div>
                  {copy.report.companies.map((company) => (
                    <div className="hero-company" key={company.index}>
                      <span className="hero-company__index">{company.index}</span>
                      <div><strong>{company.name}</strong><small>{company.detail}</small></div>
                      <span className={`hero-role ${company.roleClass}`}>{company.role}</span>
                      <b>{company.confidence}</b>
                    </div>
                  ))}
                  <div className="hero-report__bottom">
                    <div><span>{copy.report.costLabel}</span><strong>¥18,000 <i>—</i> ¥22,500</strong><small>{copy.report.costNote}</small></div>
                    <span className="hero-report__export"><FileText size={15} aria-hidden="true" /> {copy.report.export} <ArrowUpRight size={14} aria-hidden="true" /></span>
                  </div>
                </div>
              </div>
              <div className="hero-evidence-note"><ShieldCheck size={20} aria-hidden="true" /><div><strong>{copy.report.evidenceTitle}</strong><span>{copy.report.evidenceNote}</span></div><span>03</span></div>
              <span className="hero-visual__caption">{copy.report.caption}</span>
            </div>
          </div>
          <div className="landing-shell landing-hero__foot"><span>{copy.hero.foot}</span><a href="#features">{copy.hero.down} <span aria-hidden="true">↓</span></a></div>
        </section>

        <section className="landing-questions" aria-labelledby="questions-title">
          <div className="landing-shell">
            <p className="landing-section-kicker">{copy.questions.kicker}</p>
            <h2 id="questions-title">{copy.questions.title}</h2>
            <div className="landing-question-grid">
              {copy.questions.items.map((item) => <article key={item.tag}><span>{item.tag}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="landing-features" id="features" tabIndex={-1} aria-labelledby="features-title">
          <div className="landing-shell">
            <div className="landing-section-heading landing-section-heading--dark">
              <div><p className="landing-section-kicker">{copy.features.kicker}</p><h2 id="features-title">{copy.features.titleA}<br />{copy.features.titleB}</h2></div>
              <p>{copy.features.intro}</p>
            </div>
            <div className="landing-feature-grid">
              {copy.features.items.map((feature, index) => {
                const Icon = FEATURE_ICONS[index]
                return (
                  <article className={`feature-card ${FEATURE_CLASSES[index]}`} key={feature.index}>
                    <div className="feature-card__top"><span className="feature-card__icon"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span><span className="feature-card__index">{feature.index}</span></div>
                    <p className="feature-card__subtitle">{feature.subtitle}</p>
                    <h3>{feature.title}</h3>
                    <p className="feature-card__description">{feature.description}</p>
                    <p className="feature-card__note"><span />{feature.note}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="landing-workflow" id="workflow" tabIndex={-1} aria-labelledby="workflow-title">
          <div className="landing-shell landing-workflow__layout">
            <div className="landing-workflow__intro">
              <p className="landing-section-kicker">{copy.workflow.kicker}</p>
              <h2 id="workflow-title">{copy.workflow.titleA}<br />{copy.workflow.titleB}</h2>
              <p>{copy.workflow.intro}</p>
              <a className="landing-inline-link" href="#demo">{copy.workflow.cta} <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
            <ol className="landing-workflow__steps">
              {copy.workflow.steps.map((step) => (
                <li key={step.number}>
                  <span className="workflow-step__number">{step.number}</span>
                  <div><p className="workflow-step__english">{step.english}</p><h3>{step.title}</h3><p className="workflow-step__description">{step.description}</p><ul>{step.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="landing-demo" id="demo" tabIndex={-1} aria-labelledby="demo-title">
          <div className="landing-shell">
            <div className="landing-section-heading">
              <div><p className="landing-section-kicker">{copy.demo.kicker}</p><h2 id="demo-title">{copy.demo.title}</h2></div>
              <p>{copy.demo.intro}</p>
            </div>
            <div className="landing-demo__frame">
              <div className="landing-demo__bar"><span><i /><i /><i /></span><p>{copy.demo.bar}</p><span>PLAY / REVIEW</span></div>
              <video aria-label={copy.demo.aria} src="/product-demo.mp4" controls preload="metadata" playsInline>{copy.demo.fallback}</video>
            </div>
            <div className="landing-demo__notes"><span><Play size={14} aria-hidden="true" /> {copy.demo.noteA}</span><span>{copy.demo.noteB}</span><a href="#top">{copy.demo.back} <ArrowUpRight size={14} aria-hidden="true" /></a></div>
          </div>
        </section>

        <section className="landing-privacy" aria-labelledby="privacy-title">
          <div className="landing-shell landing-privacy__layout">
            <div className="landing-privacy__icon" aria-hidden="true"><LockKeyhole size={36} strokeWidth={1.25} /></div>
            <div><p className="landing-section-kicker">{copy.privacy.kicker}</p><h2 id="privacy-title">{copy.privacy.title}</h2></div>
            <p>{copy.privacy.description}</p>
            <ul>{copy.privacy.items.map((item, index) => {
              const Icon = PRIVACY_ICONS[index]
              return <li key={item}><Icon size={17} aria-hidden="true" /> {item}</li>
            })}</ul>
          </div>
        </section>

        <section className="landing-faq" id="faq" tabIndex={-1} aria-labelledby="faq-title">
          <div className="landing-shell landing-faq__layout">
            <div><p className="landing-section-kicker">{copy.faq.kicker}</p><h2 id="faq-title">{copy.faq.titleA}<br />{copy.faq.titleB}</h2></div>
            <div className="landing-faq__list">
              {copy.faq.items.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.question}</strong><ChevronDown size={18} aria-hidden="true" /></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-final" aria-labelledby="final-title">
          <div className="landing-final__grid" aria-hidden="true" />
          <div className="landing-shell landing-final__inner">
            <p className="landing-eyebrow"><span /> {copy.final.eyebrow}</p>
            <h2 id="final-title">{copy.final.titleA}<br /><em>{copy.final.titleHighlight}</em></h2>
            <p>{copy.final.description}</p>
            <a className="landing-button landing-button--light" href="#demo">{copy.final.cta} <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-shell landing-footer__inner"><Brand homeLabel={copy.brandHome} /><p>{copy.footer.tagline}</p><div><a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub / ShowProof</a><span>{copy.footer.copyright}</span></div></div>
      </footer>
    </div>
  )
}
