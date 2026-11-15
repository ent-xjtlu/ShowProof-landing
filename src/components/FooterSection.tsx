import { ArrowRight } from 'lucide-react'
import type { PageCopy } from '../content'
import { Brand, GITHUB_URL } from './Brand'

interface FinalSectionProps {
  final: PageCopy['final']
}

export function FinalSection({ final }: FinalSectionProps) {
  return (
    <section className="landing-final" aria-labelledby="final-title">
      <div className="landing-final__grid" aria-hidden="true" />
      <div className="landing-shell landing-final__inner">
        <p className="landing-eyebrow">
          <span /> {final.eyebrow}
        </p>
        <h2 id="final-title">
          {final.titleA}
          <br />
          <em>{final.titleHighlight}</em>
        </h2>
        <p>{final.description}</p>
        <a className="landing-button landing-button--light" href="#demo">
          {final.cta} <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

interface FooterProps {
  brandHome: string
  footer: PageCopy['footer']
}

export function Footer({ brandHome, footer }: FooterProps) {
  return (
    <footer className="landing-footer">
      <div className="landing-shell landing-footer__inner">
        <Brand homeLabel={brandHome} />
        <p>{footer.tagline}</p>
        <div>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub / ShowProof
          </a>
          <span>{footer.copyright}</span>
        </div>
      </div>
    </footer>
  )
}
