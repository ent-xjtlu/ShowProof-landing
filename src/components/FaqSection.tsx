import { ChevronDown, Database, Globe2, LockKeyhole, ShieldCheck } from 'lucide-react'
import type { PageCopy } from '../content'

const PRIVACY_ICONS = [Database, ShieldCheck, Globe2]

interface FaqSectionProps {
  privacy: PageCopy['privacy']
  faq: PageCopy['faq']
}

export function FaqSection({ privacy, faq }: FaqSectionProps) {
  return (
    <>
      <section className="landing-privacy" aria-labelledby="privacy-title">
        <div className="landing-shell landing-privacy__layout">
          <div className="landing-privacy__icon" aria-hidden="true">
            <LockKeyhole size={36} strokeWidth={1.25} />
          </div>
          <div>
            <p className="landing-section-kicker">{privacy.kicker}</p>
            <h2 id="privacy-title">{privacy.title}</h2>
          </div>
          <p>{privacy.description}</p>
          <ul>
            {privacy.items.map((item, index) => {
              const Icon = PRIVACY_ICONS[index]
              return (
                <li key={item}>
                  <Icon size={17} aria-hidden="true" /> {item}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section
        className="landing-faq"
        id="faq"
        tabIndex={-1}
        aria-labelledby="faq-title"
      >
        <div className="landing-shell landing-faq__layout">
          <div>
            <p className="landing-section-kicker">{faq.kicker}</p>
            <h2 id="faq-title">
              {faq.titleA}
              <br />
              {faq.titleB}
            </h2>
          </div>
          <div className="landing-faq__list">
            {faq.items.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item.question}</strong>
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
