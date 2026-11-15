import { ArrowRight, Check, Play } from 'lucide-react'
import type { Language, PageCopy } from '../content'
import { HeroReportCard } from './HeroReportCard'

interface HeroSectionProps {
  copy: PageCopy
  language: Language
}

export function HeroSection({ copy, language }: HeroSectionProps) {
  return (
    <section className="landing-hero" aria-labelledby="hero-title">
      <div className="landing-hero__grid" aria-hidden="true" />
      <div className="landing-shell landing-hero__inner">
        <div className="landing-hero__copy">
          <p className="landing-eyebrow">
            <span /> {copy.hero.eyebrow}
          </p>
          <h1 id="hero-title">
            {copy.hero.titleA}
            <br />
            {copy.hero.titleB}
            <br className="landing-mobile-break" />
            <em>{copy.hero.titleHighlight}</em>
            {copy.hero.titleC}
          </h1>
          <p className="landing-hero__lead">
            {copy.hero.lead}
            <strong>{copy.hero.leadStrong}</strong>
            {language === 'zh' ? '。' : '.'}
          </p>
          <div className="landing-hero__actions">
            <a className="landing-button landing-button--primary" href="#features">
              {copy.hero.primary} <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="landing-button landing-button--text" href="#demo">
              <span className="landing-play">
                <Play size={13} fill="currentColor" aria-hidden="true" />
              </span>{' '}
              {copy.hero.watch}
            </a>
          </div>
          <ul
            className="landing-hero__proof"
            aria-label={language === 'zh' ? '产品特点' : 'Product highlights'}
          >
            {copy.hero.proofs.map((proof) => (
              <li key={proof}>
                <Check size={14} aria-hidden="true" /> {proof}
              </li>
            ))}
          </ul>
        </div>

        <HeroReportCard report={copy.report} />
      </div>

      <div className="landing-shell landing-hero__foot">
        <span>{copy.hero.foot}</span>
        <a href="#features">
          {copy.hero.down} <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  )
}
