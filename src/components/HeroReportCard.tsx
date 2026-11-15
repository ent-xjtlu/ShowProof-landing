import { useState } from 'react'
import { ArrowUpRight, CircleCheck, FileText } from 'lucide-react'
import type { PageCopy } from '../content'
import { ExVisMark } from './Brand'

interface HeroReportCardProps {
  report: PageCopy['report']
}

export function HeroReportCard({ report }: HeroReportCardProps) {
  const [selectedCompany, setSelectedCompany] = useState<number | null>(0)
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0)

  const currentPlan = report.plans[selectedPlanIndex] ?? report.plans[0]

  return (
    <div className="landing-hero__visual" role="group" aria-label={report.aria}>
      <div className="hero-report">
        <div className="hero-report__bar">
          <div className="hero-report__mini-brand">
            <span className="landing-brand__mark" aria-hidden="true">
              <ExVisMark />
            </span>
            <b>
              ExVis<span className="landing-brand__zh">展视</span>
            </b>
            <span>/ {report.heading}</span>
          </div>
          <div className="hero-report__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="hero-report__body">
          <div className="hero-report__title-row">
            <div>
              <h2>{report.name}</h2>
              <span>{report.context}</span>
            </div>
            <div className="hero-score">
              <strong>73</strong>
              <span>{report.score}</span>
            </div>
          </div>

          <div className="hero-verdict">
            <span className="hero-verdict__main">
              <CircleCheck size={17} aria-hidden="true" />
              <strong>{report.verdict}</strong>
            </span>
            <span className="hero-verdict__hint">{report.verdictHint}</span>
          </div>

          <div className="hero-report__stats">
            {report.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="hero-report__section-head">
            <span>{report.companiesTitle}</span>
            <span>{report.booth}</span>
          </div>

          <div className="hero-company-list">
            {report.companies.map((company, index) => {
              const isOpen = selectedCompany === index
              return (
                <div
                  className={`hero-company ${isOpen ? 'is-selected' : ''}`}
                  key={company.name}
                >
                  <button
                    type="button"
                    className="hero-company__trigger"
                    aria-expanded={isOpen}
                    onClick={() => setSelectedCompany(isOpen ? null : index)}
                  >
                    <span className="hero-company__info">
                      <strong>
                        <span className="hero-company__dot" aria-hidden="true" />
                        {company.name}
                      </strong>
                      <small>{company.detail}</small>
                    </span>
                    <span className={`hero-role ${company.roleClass}`}>{company.role}</span>
                    <b className="hero-company__booth">{company.booth}</b>
                  </button>
                  {isOpen && (
                    <p className="hero-company__evidence">{company.evidence}</p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="hero-report__bottom">
            <div className="hero-report__plans" role="group" aria-label={report.plansLabel}>
              {report.plans.map((plan, index) => (
                <button
                  key={plan.id}
                  type="button"
                  className={`hero-report__plan-tab ${selectedPlanIndex === index ? 'is-active' : ''}`}
                  aria-pressed={selectedPlanIndex === index}
                  onClick={() => setSelectedPlanIndex(index)}
                >
                  {plan.tab}
                </button>
              ))}
            </div>
            <div className="hero-report__budget-row">
              <div className="hero-report__budget-info">
                <span>{currentPlan.label}</span>
                <strong>
                  {currentPlan.min} <i>—</i> {currentPlan.max}
                </strong>
                <small>{currentPlan.basis}</small>
              </div>
              <a className="hero-report__export" href="#demo">
                <FileText size={15} aria-hidden="true" /> {report.export}{' '}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
