import {
  BadgeDollarSign,
  Building2,
  FileCheck2,
  MessageSquareText,
  Radar,
  ScanSearch,
} from 'lucide-react'
import type { PageCopy } from '../content'

const FEATURE_ICONS = [
  ScanSearch,
  Building2,
  BadgeDollarSign,
  FileCheck2,
  Radar,
  MessageSquareText,
]

const FEATURE_CLASSES = [
  'feature-card--wide',
  'feature-card--tall',
  '',
  '',
  '',
  'feature-card--wide feature-card--copper',
]

interface CapabilitySectionProps {
  copy: PageCopy
}

export function CapabilitySection({ copy }: CapabilitySectionProps) {
  return (
    <>
      <section className="landing-questions" aria-labelledby="questions-title">
        <div className="landing-shell">
          <p className="landing-section-kicker">{copy.questions.kicker}</p>
          <h2 id="questions-title">{copy.questions.title}</h2>
          <div className="landing-question-grid">
            {copy.questions.items.map((item) => (
              <article key={item.tag}>
                <span>{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="landing-features"
        id="features"
        tabIndex={-1}
        aria-labelledby="features-title"
      >
        <div className="landing-shell">
          <div className="landing-section-heading landing-section-heading--dark">
            <div>
              <p className="landing-section-kicker">{copy.features.kicker}</p>
              <h2 id="features-title">
                {copy.features.titleA}
                <br />
                {copy.features.titleB}
              </h2>
            </div>
            <p>{copy.features.intro}</p>
          </div>

          <div className="landing-feature-grid">
            {copy.features.items.map((feature, index) => {
              const Icon = FEATURE_ICONS[index]
              return (
                <article
                  className={`feature-card ${FEATURE_CLASSES[index]}`}
                  key={feature.index}
                >
                  <div className="feature-card__top">
                    <span className="feature-card__icon">
                      <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span className="feature-card__index">{feature.index}</span>
                  </div>
                  <p className="feature-card__subtitle">{feature.subtitle}</p>
                  <h3>{feature.title}</h3>
                  <p className="feature-card__description">{feature.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
