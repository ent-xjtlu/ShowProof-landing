import { useEffect, useState } from 'react'
import { CONTENT, type Language } from '../content'
import { CapabilitySection } from './CapabilitySection'
import { DemoSection } from './DemoSection'
import { FaqSection } from './FaqSection'
import { FinalSection, Footer } from './FooterSection'
import { Header } from './Header'
import { HeroSection } from './HeroSection'
import { WorkflowSection } from './WorkflowSection'

const LANGUAGE_KEY = 'shizheng-language'

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'zh'
  const requested = new URLSearchParams(window.location.search).get('lang')
  if (requested === 'en' || requested === 'zh') return requested
  try {
    return window.localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'zh'
  } catch {
    return 'zh'
  }
}

export function MarketingPage() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage)
  const copy = CONTENT[language]

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
    document.title = copy.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.meta.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', copy.meta.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', copy.meta.description)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', language === 'zh' ? 'zh_CN' : 'en_US')
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', copy.meta.title)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', copy.meta.description)
    try {
      window.localStorage.setItem(LANGUAGE_KEY, language)
    } catch {
      return
    }
  }, [copy.meta.description, copy.meta.title, language])

  const switchLanguage = () => {
    const next: Language = language === 'zh' ? 'en' : 'zh'
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', next)
      window.history.replaceState(window.history.state, '', url)
    }
    setLanguage(next)
  }

  return (
    <div className="landing-page" id="top">
      <a className="landing-skip" href="#main-content">
        {copy.skip}
      </a>
      <Header copy={copy} language={language} onSwitchLanguage={switchLanguage} />
      <main id="main-content">
        <HeroSection copy={copy} language={language} />
        <CapabilitySection copy={copy} />
        <WorkflowSection workflow={copy.workflow} />
        <DemoSection demo={copy.demo} />
        <FaqSection privacy={copy.privacy} faq={copy.faq} />
        <FinalSection final={copy.final} />
      </main>
      <Footer brandHome={copy.brandHome} footer={copy.footer} />
    </div>
  )
}
